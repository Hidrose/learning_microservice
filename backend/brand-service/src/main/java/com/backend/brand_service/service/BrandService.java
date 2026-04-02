package com.backend.brand_service.service;

import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.brand_service.client.ProductServiceClient;
import com.backend.brand_service.dto.request.BrandRequest;
import com.backend.brand_service.dto.response.BrandResponse;
import com.backend.brand_service.entity.Brand;
import com.backend.brand_service.exception.AppException;
import com.backend.brand_service.exception.ErrorCode;
import com.backend.brand_service.mapper.BrandMapper;
import com.backend.brand_service.repository.BrandRepository;
import com.backend.brand_service.util.SlugUtil;

@Service
public class BrandService {
    private final BrandRepository brandRepository;
    private final ProductServiceClient productServiceClient;

    public BrandService(BrandRepository brandRepository, ProductServiceClient productServiceClient) {
        this.brandRepository = brandRepository;
        this.productServiceClient = productServiceClient;
    }

    // lấy tất cả brand phân trang
    public Page<BrandResponse> getBrands(int page, int limit, String q, Integer status) {
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());

        Page<Brand> pageBrand;

        if (q != null && !q.isEmpty() && status != null) {
            pageBrand = brandRepository
                    .findByNameContainingIgnoreCaseAndStatus(q, status, pageable);
        } else if (q != null && !q.isEmpty()) {
            pageBrand = brandRepository
                    .findByNameContainingIgnoreCase(q, pageable);
        } else if (status != null) {
            pageBrand = brandRepository
                    .findByStatus(status, pageable);
        } else {
            pageBrand = brandRepository.findAll(pageable);
        }

        return pageBrand.map(BrandMapper::toResponse);
    }

    // lấy tất cả brand không phân trang
    public List<BrandResponse> getAllBrands() {
        return brandRepository
                .findAll(Sort.by("createdAt").descending())
                .stream()
                .map(BrandMapper::toResponse)
                .collect(Collectors.toList());
    }

    // lấy các brand có status = 1
    public List<BrandResponse> getActiveBrands() {

        return brandRepository
                .findByStatus(1)
                .stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(BrandMapper::toResponse)
                .collect(Collectors.toList());
    }

    // lấy 1 brand theo id
    public BrandResponse getBrandById(String id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));

        return BrandMapper.toResponse(brand);
    }

    // lấy 1 brand theo slug
    public BrandResponse getBrandBySlug(String slug) {
        Brand brand = brandRepository.findBySlug(slug)
                .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));

        return BrandMapper.toResponse(brand);
    }

    // tạo brand
    public void createBrand(BrandRequest request) {

        if (brandRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.BRAND_NAME_EXISTS);
        }

        Brand brand = BrandMapper.toEntity(request);
        brand.setSlug(SlugUtil.toSlug(request.getName()));

        brandRepository.save(brand);
    }

    // cập nhật brand
    public void updateBrand(String id, BrandRequest request) {

        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));

        brandRepository.findByName(request.getName())
                .filter(b -> !b.getId().equals(id))
                .ifPresent(b -> {
                    throw new AppException(ErrorCode.BRAND_NAME_EXISTS);
                });

        BrandMapper.updateEntity(brand, request);
        brand.setSlug(SlugUtil.toSlug(brand.getName()));

        brand = brandRepository.save(brand);
    }

    // cập nhật status
    @Transactional
    public void updateBrandStatus(String id, Integer status) {

        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));

        brand.setStatus(status);
        brandRepository.save(brand);

        // brand bị ẩn → toàn bộ product bị ẩn theo
        if (Objects.equals(status, 0)) {
            productServiceClient.hideProductsByBrandInternal(id);
        }
    }

    // xóa brand
    public void deleteBrand(String id) {

        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));

        Boolean isUsed = productServiceClient.existsProductByBrandIdInternal(id);

        if (Boolean.TRUE.equals(isUsed)) {
            throw new AppException(ErrorCode.BRAND_IN_USE);
        }

        brandRepository.delete(brand);
    }

    public Map<String, BrandResponse> getBrandsByIds(List<String> ids) {

        return brandRepository.findAllById(ids)
                .stream()
                .collect(Collectors.toMap(
                        Brand::getId,
                        BrandMapper::toResponse));
    }
}
