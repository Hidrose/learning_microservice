package com.backend.category_service.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.backend.category_service.client.ProductServiceClient;
import com.backend.category_service.dto.request.CategoryRequest;
import com.backend.category_service.dto.response.CategoryResponse;
import com.backend.category_service.entity.Category;
import com.backend.category_service.exception.AppException;
import com.backend.category_service.exception.ErrorCode;
import com.backend.category_service.mapper.CategoryMapper;
import com.backend.category_service.repository.CategoryRepository;
import com.backend.category_service.utils.SlugUtil;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductServiceClient productServiceClient;
    private final Cloudinary cloudinary;

    public CategoryService(CategoryRepository categoryRepository, Cloudinary cloudinary,
            ProductServiceClient productServiceClient) {
        this.categoryRepository = categoryRepository;
        this.cloudinary = cloudinary;
        this.productServiceClient = productServiceClient;
    }

    // lấy tất cả category phân trang
    public Page<CategoryResponse> getCategories(int page, int limit, String q, Integer status) {
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());

        Page<Category> pageCategory;

        if (q != null && !q.isEmpty() && status != null) {
            pageCategory = categoryRepository
                    .findByNameContainingIgnoreCaseAndStatus(q, status, pageable);
        } else if (q != null && !q.isEmpty()) {
            pageCategory = categoryRepository
                    .findByNameContainingIgnoreCase(q, pageable);
        } else if (status != null) {
            pageCategory = categoryRepository
                    .findByStatus(status, pageable);
        } else {
            pageCategory = categoryRepository.findAll(pageable);
        }

        return pageCategory.map(CategoryMapper::toResponse);
    }

    // lấy tất cả category không phân trang
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository
                .findAll(Sort.by("createdAt").descending())
                .stream()
                .map(CategoryMapper::toResponse)
                .collect(Collectors.toList());
    }

    // lấy các category có status = 1
    public List<CategoryResponse> getActiveCategories() {

        return categoryRepository
                .findByStatus(1)
                .stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(CategoryMapper::toResponse)
                .collect(Collectors.toList());
    }

    // lấy 1 category theo id
    public CategoryResponse getCategoryById(String id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        return CategoryMapper.toResponse(category);
    }

    // lấy 1 category theo slug
    public CategoryResponse getCategoryBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        return CategoryMapper.toResponse(category);
    }

    // thêm category
    @Transactional
    public void createCategory(CategoryRequest request, MultipartFile image) {

        if (categoryRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.CATEGORY_NAME_EXISTS);
        }

        if (image == null || image.isEmpty()) {
            throw new AppException(ErrorCode.IMAGE_REQUIRED);
        }

        Category category = CategoryMapper.toEntity(request);
        category.setSlug(SlugUtil.toSlug(request.getName()));

        // set ảnh tạm
        category.setImage("PENDING");

        Category saved = categoryRepository.save(category);

        // upload ảnh thật
        String imageUrl = uploadImageOnCloudinary(image, saved.getId());

        // update
        saved.setImage(imageUrl);

        categoryRepository.save(saved);
    }

    // cập nhật category
    @Transactional
    public void updateCategory(
            String id,
            CategoryRequest request,
            MultipartFile image) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        categoryRepository.findByName(request.getName())
                .filter(c -> !c.getId().equals(id))
                .ifPresent(c -> {
                    throw new AppException(ErrorCode.CATEGORY_NAME_EXISTS);
                });

        CategoryMapper.updateEntity(category, request);
        category.setSlug(SlugUtil.toSlug(category.getName()));

        if (image != null && !image.isEmpty()) {
            String imageUrl = uploadImageOnCloudinary(image, category.getId());
            category.setImage(imageUrl);
        }
    }

    // cập nhật status
    @Transactional
    public void updateCategoryStatus(String id, Integer status) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        category.setStatus(status);
        categoryRepository.save(category);

        // category ẩn → product ẩn theo
        if (Objects.equals(status, 0)) {
            productServiceClient.hideProductsByCategoryInternal(id);
        }
    }

    // xóa category
    @Transactional
    public void deleteCategory(String id) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        Boolean isUsed = productServiceClient.existsProductByCategoryIdInternal(id);

        if (Boolean.TRUE.equals(isUsed)) {
            throw new AppException(
                    ErrorCode.CATEGORY_IN_USE);
        }

        deleteFolderOnCloudinary(category.getId());

        categoryRepository.delete(category);
    }

    public Map<String, CategoryResponse> getCategoriesByIds(List<String> ids) {

        return categoryRepository.findAllById(ids)
                .stream()
                .collect(Collectors.toMap(
                        Category::getId,
                        CategoryMapper::toResponse));
    }

    private void deleteFolderOnCloudinary(String categoryId) {
        try {
            String folderPath = "nckh/categories/" + categoryId;

            cloudinary.api().deleteResourcesByPrefix(
                    folderPath,
                    ObjectUtils.emptyMap());

            cloudinary.api().deleteFolder(
                    folderPath,
                    ObjectUtils.emptyMap());

        } catch (Exception e) {
            throw new AppException(ErrorCode.IMAGE_DELETE_FAILED);
        }
    }

    private String uploadImageOnCloudinary(MultipartFile file, String categoryId) {

        // validate size (2MB)
        if (file.getSize() > 2 * 1024 * 1024) {
            throw new AppException(ErrorCode.IMAGE_TOO_LARGE);
        }

        // validate type
        String contentType = file.getContentType();
        List<String> allowedTypes = List.of(
                "image/jpeg",
                "image/png",
                "image/webp",
                "image/svg+xml");

        if (contentType == null || !allowedTypes.contains(contentType)) {
            throw new AppException(ErrorCode.IMAGE_INVALID_TYPE);
        }

        try {
            String folderPath = "nckh/categories/" + categoryId;

            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", folderPath,
                            "public_id", categoryId));

            return uploadResult.get("secure_url").toString();

        } catch (IOException e) {
            throw new AppException(ErrorCode.IMAGE_UPLOAD_FAILED);
        }
    }

}
