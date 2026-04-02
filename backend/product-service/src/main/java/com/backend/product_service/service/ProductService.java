package com.backend.product_service.service;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import com.backend.product_service.client.BrandServiceClient;
import com.backend.product_service.client.CartServiceClient;
import com.backend.product_service.client.CategoryServiceClient;
import com.backend.product_service.client.OrderServiceClient;
import com.backend.product_service.dto.request.ProductQueryRequest;
import com.backend.product_service.dto.request.ProductRequest;
import com.backend.product_service.dto.request.SpecificationRequest;
import com.backend.product_service.dto.request.StockRequest;
import com.backend.product_service.dto.response.BrandResponse;
import com.backend.product_service.dto.response.CategoryResponse;
import com.backend.product_service.dto.response.ProductAssistantResponse;
import com.backend.product_service.dto.response.ProductDetailResponse;
import com.backend.product_service.dto.response.ProductListItemResponse;
import com.backend.product_service.entity.ImageProduct;
import com.backend.product_service.entity.Product;
import com.backend.product_service.entity.Specification;
import com.backend.product_service.exception.AppException;
import com.backend.product_service.exception.ErrorCode;
import com.backend.product_service.mapper.ProductMapper;
import com.backend.product_service.repository.ImageProductRepository;
import com.backend.product_service.repository.ProductRepository;
import com.backend.product_service.repository.SpecificationRepository;
import com.backend.product_service.utils.SlugUtil;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import java.util.Comparator;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final ImageProductRepository imageProductRepository;
    private final SpecificationRepository specificationRepository;
    private final CategoryServiceClient categoryServiceClient;
    private final BrandServiceClient brandServiceClient;
    private final CartServiceClient cartServiceClient;
    private final OrderServiceClient orderServiceClient;
    private final Cloudinary cloudinary;

    public ProductService(ProductRepository productRepository, ImageProductRepository imageProductRepository,
            SpecificationRepository specificationRepository,
            CategoryServiceClient categoryServiceClient,
            BrandServiceClient brandServiceClient,
            CartServiceClient cartServiceClient,
            OrderServiceClient orderServiceClient,
            Cloudinary cloudinary) {
        this.productRepository = productRepository;
        this.imageProductRepository = imageProductRepository;
        this.specificationRepository = specificationRepository;
        this.categoryServiceClient = categoryServiceClient;
        this.brandServiceClient = brandServiceClient;
        this.cartServiceClient = cartServiceClient;
        this.orderServiceClient = orderServiceClient;
        this.cloudinary = cloudinary;
    }

    // lấy tất cả sản phẩm có phân trang
    public Page<ProductListItemResponse> getAllProducts(
            int page,
            int limit,
            String q,
            Integer status) {

        Pageable pageable = PageRequest.of(
                page - 1,
                limit,
                Sort.by("createdAt").descending());

        Page<Product> productPage;

        if (q != null && !q.isBlank() && status != null) {
            productPage = productRepository
                    .findByNameContainingIgnoreCaseAndStatus(q, status, pageable);
        } else if (q != null && !q.isBlank()) {
            productPage = productRepository
                    .findByNameContainingIgnoreCase(q, pageable);
        } else if (status != null) {
            productPage = productRepository
                    .findByStatus(status, pageable);
        } else {
            productPage = productRepository.findAll(pageable);
        }

        return mapPageWithClient(productPage);
    }

    // lấy các sản phẩm có status = 1 phân trang
    public Page<ProductListItemResponse> getActiveProducts(
            int page,
            int limit,
            String q,
            String sort) {

        Pageable pageable = PageRequest.of(
                page - 1,
                limit,
                buildSort(sort));

        Page<Product> productPage = (q != null && !q.isBlank())
                ? productRepository.findByStatusAndNameContainingIgnoreCase(1, q, pageable)
                : productRepository.findByStatus(1, pageable);

        return mapPageWithClient(productPage);
    }

    // lấy các sản phẩm dựa vào category slug và có status = 1 phân trang
    public Page<ProductListItemResponse> getActiveProductsByCategory(
            int page,
            int limit,
            String q,
            String sort,
            String slug) {

        CategoryResponse category = categoryServiceClient.getCategoryBySlugInternal(slug);

        Pageable pageable = PageRequest.of(
                page - 1,
                limit,
                buildSort(sort));

        Page<Product> productPage = (q != null && !q.isBlank())
                ? productRepository.findByStatusAndCategoryIdAndNameContainingIgnoreCase(
                        1, category.getId(), q, pageable)
                : productRepository.findByStatusAndCategoryId(
                        1, category.getId(), pageable);

        return mapPageWithClient(productPage);
    }

    // lấy các sản phẩm giảm giá có status = 1
    public Page<ProductListItemResponse> getActiveDiscountProducts(
            int page,
            int limit,
            String q,
            String sort) {

        Pageable pageable = PageRequest.of(
                page - 1,
                limit,
                buildSort(sort));

        Page<Product> productPage = (q != null && !q.isBlank())
                ? productRepository
                        .findByStatusAndDiscountGreaterThanAndNameContainingIgnoreCase(
                                1, BigDecimal.ZERO, q, pageable)
                : productRepository
                        .findByStatusAndDiscountGreaterThan(
                                1, BigDecimal.ZERO, pageable);

        return mapPageWithClient(productPage);
    }

    // lấy x sản phẩm bán chạy nhất có status = 1
    public List<ProductListItemResponse> getActiveBestSellerProducts(Integer limit) {

        int size = (limit == null) ? 10 : limit;

        List<Product> products = productRepository
                .findByStatusAndTotalSoldGreaterThan(
                        1,
                        0,
                        Sort.by("totalSold").descending());

        if (products.size() > size) {
            products = products.subList(0, size);
        }

        return mapWithClient(products);
    }

    // lấy x sản phẩm status = 1
    public List<ProductListItemResponse> getActiveLimitProducts(String q, Integer limit) {

        int size = (limit != null && limit > 0) ? limit : 10;

        List<Product> products;

        if (q != null && !q.isBlank()) {
            products = productRepository.searchActiveProducts(
                    q.toLowerCase(),
                    PageRequest.of(0, size));
        } else {
            products = productRepository.findByStatus(
                    1,
                    Sort.by("createdAt").descending());

            if (products.size() > size) {
                products = products.subList(0, size);
            }
        }

        return mapWithClient(products);
    }

    // lấy tất cả sản phẩm có status = 1 theo category id
    public List<ProductListItemResponse> getAllActiveProductsByCategoryId(String categoryId) {

        List<Product> products = productRepository.findByStatusAndCategoryId(
                1,
                categoryId,
                Sort.by("createdAt").descending());

        return mapWithClient(products);
    }

    // lấy tất cả sản phẩm có status = 1 theo brand id
    public List<ProductListItemResponse> getAllActiveProductsByBrandId(String brandId) {

        List<Product> products = productRepository.findByStatusAndBrandId(
                1,
                brandId,
                Sort.by("createdAt").descending());

        return mapWithClient(products);
    }

    // lấy sản phẩm theo id
    public ProductDetailResponse getProductById(String id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        return mapSingleWithClient(product);
    }

    // lấy sản phẩm theo slug có status = 1
    public ProductDetailResponse getActiveProductBySlug(String slug) {

        Product product = productRepository
                .findBySlugAndStatus(slug, 1)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        return mapSingleWithClient(product);
    }

    // lấy sản phẩm có status = 1 theo id
    public ProductDetailResponse getActiveProductById(String id) {

        Product product = productRepository
                .findByIdAndStatus(id, 1)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        return mapSingleWithClient(product);
    }

    // assistant
    public List<ProductAssistantResponse> queryProductsForAssistant(ProductQueryRequest request) {

        String categoryId = null;
        if (request.getCategory() != null && !request.getCategory().isBlank()) {
            try {
                CategoryResponse category = categoryServiceClient
                        .getCategoryBySlugInternal(request.getCategory());
                categoryId = category.getId();
            } catch (Exception e) {
                return List.of();
            }
        }

        String brandId = null;
        if (request.getBrand() != null && !request.getBrand().isBlank()) {
            try {
                BrandResponse brand = brandServiceClient
                        .getBrandBySlugInternal(request.getBrand());
                brandId = brand.getId();
            } catch (Exception e) {
                return List.of();
            }
        }

        Sort sort = buildSort(request.getSortBy());
        List<Product> products = productRepository.findByStatus(1, sort);

        if (categoryId != null) {
            final String cId = categoryId;
            products = products.stream()
                    .filter(p -> cId.equals(p.getCategoryId()))
                    .toList();
        }

        if (brandId != null) {
            final String bId = brandId;
            products = products.stream()
                    .filter(p -> bId.equals(p.getBrandId()))
                    .toList();
        }

        if (request.getKeyword() != null && !request.getKeyword().isBlank()) {
            String kw = request.getKeyword().toLowerCase();
            products = products.stream()
                    .filter(p -> p.getName().toLowerCase().contains(kw))
                    .toList();
        }

        if (request.getMinPrice() != null) {
            products = products.stream()
                    .filter(p -> p.getFinalPrice().compareTo(request.getMinPrice()) >= 0)
                    .toList();
        }
        if (request.getMaxPrice() != null) {
            products = products.stream()
                    .filter(p -> p.getFinalPrice().compareTo(request.getMaxPrice()) <= 0)
                    .toList();
        }

        if (Boolean.TRUE.equals(request.getIsDiscount())) {
            products = products.stream()
                    .filter(p -> p.getDiscount() != null
                            && p.getDiscount().compareTo(BigDecimal.ZERO) > 0)
                    .toList();
        }

        if (Boolean.TRUE.equals(request.getInStock())) {
            products = products.stream()
                    .filter(p -> p.getStock() != null && p.getStock() > 0)
                    .toList();
        }

        if (Boolean.TRUE.equals(request.getIsBestseller())) {
            products = products.stream()
                    .filter(p -> p.getTotalSold() != null && p.getTotalSold() > 0)
                    .sorted(Comparator.comparingInt(Product::getTotalSold).reversed())
                    .toList();
        }

        int limit = (request.getLimit() != null && request.getLimit() > 0)
                ? request.getLimit()
                : 12;
        if (products.size() > limit) {
            products = products.subList(0, limit);
        }

        return mapAssistantWithClient(products);
    }

    // cập nhật status sản phẩm
    public void updateProductStatus(String id, Integer status) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        if (status == 1) {
            CategoryResponse category = categoryServiceClient.getCategoryByIdInternal(product.getCategoryId());

            if (category.getStatus() == 0) {
                throw new AppException(
                        ErrorCode.CATEGORY_INACTIVE_CANNOT_ACTIVATE_PRODUCT);
            }

            BrandResponse brand = brandServiceClient.getBrandByIdInternal(product.getBrandId());

            if (brand.getStatus() == 0) {
                throw new AppException(
                        ErrorCode.BRAND_INACTIVE_CANNOT_ACTIVATE_PRODUCT);
            }
        }

        product.setStatus(status);
        productRepository.save(product);
    }

    // thêm sản phẩm
    @Transactional
    public void createProduct(
            ProductRequest request,
            List<MultipartFile> files) {

        if (request.getPrice() == null
                || request.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new AppException(ErrorCode.INVALID_PRICE);
        }

        if (request.getDiscount() != null) {
            if (request.getDiscount().compareTo(BigDecimal.ZERO) < 0) {
                throw new AppException(ErrorCode.DISCOUNT_NEGATIVE);
            }

            if (request.getDiscount().compareTo(request.getPrice()) >= 0) {
                throw new AppException(ErrorCode.DISCOUNT_EXCEEDS_PRICE);
            }
        }

        BigDecimal percent = request.getDiscount()
                .divide(request.getPrice(), 4, RoundingMode.DOWN)
                .multiply(BigDecimal.valueOf(100))
                .setScale(0, RoundingMode.DOWN);

        if (request.getDiscount() != null
                && request.getDiscount().compareTo(BigDecimal.ZERO) > 0) {

            if (percent.compareTo(BigDecimal.ONE) < 0) {
                throw new AppException(ErrorCode.DISCOUNT_TOO_SMALL);
            }
        }

        if (request.getStock() == null
                || request.getStock() < 0) {
            throw new AppException(ErrorCode.INVALID_STOCK);
        }

        if (files == null || files.isEmpty()) {
            throw new AppException(ErrorCode.PRODUCT_IMAGE_REQUIRED);
        }

        if (request.getSpecifications() == null || request.getSpecifications().isEmpty()) {
            throw new AppException(ErrorCode.SPECIFICATION_REQUIRED);
        }

        if (productRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.PRODUCT_NAME_EXISTED);
        }

        Product product = ProductMapper.toEntity(request);
        product.setSlug(SlugUtil.toSlug(request.getName()));

        product.setDiscount(
                request.getDiscount() != null ? request.getDiscount() : BigDecimal.ZERO);

        product.setFinalPrice(
                calculateFinalPrice(request.getPrice(), request.getDiscount()));

        product.getSpecifications()
                .forEach(spec -> spec.setProduct(product));

        Product savedProduct = productRepository.save(product);

        if (files != null && !files.isEmpty()) {
            try {
                for (int i = 0; i < files.size(); i++) {
                    ImageProduct image = uploadImageOnCloudinary(files.get(i), savedProduct);
                    image.setDisplayOrder(i);
                    savedProduct.getImages().add(image);
                }
            } catch (Exception e) {
                deleteFolderOnCloudinary(savedProduct.getId());
                throw e;
            }
        }
    }

    // cập nhật sản phẩm
    @Transactional
    public void updateProduct(
            String id,
            ProductRequest request,
            List<MultipartFile> files) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        if (request.getPrice() == null
                || request.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new AppException(ErrorCode.INVALID_PRICE);
        }

        if (request.getDiscount() != null) {
            if (request.getDiscount().compareTo(BigDecimal.ZERO) < 0) {
                throw new AppException(ErrorCode.DISCOUNT_NEGATIVE);
            }

            if (request.getDiscount().compareTo(request.getPrice()) >= 0) {
                throw new AppException(ErrorCode.DISCOUNT_EXCEEDS_PRICE);
            }
        }

        BigDecimal percent = request.getDiscount()
                .divide(request.getPrice(), 4, RoundingMode.DOWN)
                .multiply(BigDecimal.valueOf(100))
                .setScale(0, RoundingMode.DOWN);

        if (request.getDiscount() != null
                && request.getDiscount().compareTo(BigDecimal.ZERO) > 0) {

            if (percent.compareTo(BigDecimal.ONE) < 0) {
                throw new AppException(ErrorCode.DISCOUNT_TOO_SMALL);
            }
        }

        if (request.getStock() == null
                || request.getStock() < 0) {
            throw new AppException(ErrorCode.INVALID_STOCK);
        }

        productRepository.findByName(request.getName())
                .filter(p -> !p.getId().equals(id))
                .ifPresent(p -> {
                    throw new AppException(ErrorCode.PRODUCT_NAME_EXISTED);
                });

        ProductMapper.updateEntity(product, request);
        product.setSlug(SlugUtil.toSlug(product.getName()));

        product.setFinalPrice(
                calculateFinalPrice(request.getPrice(), request.getDiscount()));

        syncSpecifications(product, request.getSpecifications());

        if (files != null && !files.isEmpty()) {
            try {
                int nextOrder = product.getImages().stream()
                        .mapToInt(img -> img.getDisplayOrder() != null ? img.getDisplayOrder() : -1)
                        .max()
                        .orElse(-1) + 1;

                for (int i = 0; i < files.size(); i++) {
                    ImageProduct image = uploadImageOnCloudinary(files.get(i), product);
                    image.setProduct(product);
                    image.setDisplayOrder(nextOrder + i);
                    product.getImages().add(image);
                }
            } catch (Exception e) {
                deleteFolderOnCloudinary(product.getId());
                throw e;
            }
        }

    }

    // xóa sản phẩm
    @Transactional
    public void deleteProduct(String id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        boolean existsInOrder = orderServiceClient.existsProductInOrderInternal(id);

        if (existsInOrder) {
            throw new AppException(ErrorCode.PRODUCT_IN_ORDER);
        }

        deleteFolderOnCloudinary(product.getId());

        cartServiceClient.removeProductFromAllCartsInternal(product.getId());

        productRepository.delete(product);
    }

    // xóa 1 hình của sản phẩm
    @Transactional
    public void deleteProductImage(String productId, String imageId) {

        ImageProduct image = imageProductRepository.findById(imageId)
                .orElseThrow(() -> new AppException(ErrorCode.IMAGE_NOT_FOUND));

        if (!image.getProduct().getId().equals(productId)) {
            throw new AppException(ErrorCode.IMAGE_NOT_BELONG_TO_PRODUCT);
        }

        deleteImageOnCloudinary(productId, imageId);
        imageProductRepository.delete(image);
        imageProductRepository.flush();

        List<ImageProduct> remaining = imageProductRepository
                .findByProductIdOrderByDisplayOrderAsc(productId);

        for (int i = 0; i < remaining.size(); i++) {
            remaining.get(i).setDisplayOrder(i);
        }

        imageProductRepository.saveAll(remaining);
    }

    // xóa 1 thông tin chi tiết của sản phẩm
    @Transactional
    public void deleteSpecification(
            String productId,
            String specificationId) {

        Specification specification = specificationRepository.findById(specificationId)
                .orElseThrow(() -> new AppException(ErrorCode.SPECIFICATION_NOT_FOUND));

        if (!specification.getProduct().getId().equals(productId)) {
            throw new AppException(ErrorCode.SPECIFICATION_NOT_BELONG_TO_PRODUCT);
        }

        specificationRepository.delete(specification);
    }

    // kiểm tra product nào có id brand không
    public boolean existsProductByBrandId(String brandId) {
        return productRepository.existsByBrandId(brandId);
    }

    // kiểm tra product nào có id category không
    public boolean existsProductByCategoryId(String categoryId) {
        return productRepository.existsByCategoryId(categoryId);
    }

    public List<ProductListItemResponse> getProductsByIds(List<String> ids) {

        if (ids == null || ids.isEmpty()) {
            return List.of();
        }

        List<Product> products = productRepository.findByIdIn(ids);

        if (products.isEmpty()) {
            throw new AppException(ErrorCode.PRODUCT_NOT_FOUND);
        }

        return mapWithClient(products);
    }

    // trừ só lượng stock
    @Transactional
    public void decreaseStock(List<StockRequest> requests) {

        for (StockRequest req : requests) {

            Product product = productRepository.findById(req.getProductId())
                    .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

            if (product.getStock() < req.getQuantity()) {
                throw new AppException(ErrorCode.PRODUCT_OUT_OF_STOCK);
            }

            product.setStock(product.getStock() - req.getQuantity());
            product.setTotalSold(product.getTotalSold() + req.getQuantity());

            productRepository.save(product);
        }
    }

    // trả số lượng stock
    @Transactional
    public void increaseStock(List<StockRequest> requests) {

        for (StockRequest req : requests) {

            Product product = productRepository.findById(req.getProductId())
                    .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

            if (product.getStock() < req.getQuantity()) {
                throw new AppException(ErrorCode.PRODUCT_OUT_OF_STOCK);
            }

            product.setStock(product.getStock() + req.getQuantity());
            product.setTotalSold(
                    Math.max(0, product.getTotalSold() - req.getQuantity()));

            productRepository.save(product);
        }
    }

    // ẩn các sản phẩm có brand id đó
    @Transactional
    public void hideProductsByBrandId(String brandId) {
        productRepository.updateStatusByBrandId(brandId, 0);
    }

    // ẩn các sản phẩm có category id đó
    @Transactional
    public void hideProductsByCategoryId(String categoryId) {
        productRepository.updateStatusByCategoryId(categoryId, 0);
    }

    // cập nhật 1 hình của sản phẩm
    @Transactional
    public void updateProductImage(
            String productId,
            String imageId,
            MultipartFile file) {

        ImageProduct image = imageProductRepository.findById(imageId)
                .orElseThrow(() -> new AppException(ErrorCode.IMAGE_NOT_FOUND));

        if (!image.getProduct().getId().equals(productId)) {
            throw new AppException(ErrorCode.IMAGE_NOT_BELONG_TO_PRODUCT);
        }

        if (file == null || file.isEmpty()) {
            throw new AppException(ErrorCode.IMAGE_EMPTY);
        }

        deleteImageOnCloudinary(productId, imageId);

        String imageUrl = uploadImageOnCloudinaryWithId(file, productId, imageId);

        image.setImage(imageUrl);
        imageProductRepository.save(image);
    }

    // cloudinary
    private String uploadImageCore(
            MultipartFile file,
            String productId,
            String imageId) {

        // Validate size
        if (file.getSize() > 2 * 1024 * 1024) {
            throw new AppException(ErrorCode.IMAGE_SIZE_EXCEEDED);
        }

        // Validate type
        String contentType = file.getContentType();
        List<String> allowedTypes = List.of(
                "image/jpeg",
                "image/png",
                "image/webp");

        if (contentType == null || !allowedTypes.contains(contentType)) {
            throw new AppException(ErrorCode.IMAGE_TYPE_INVALID);
        }

        try {
            String folderPath = "nckh/products/" + productId + "/" + imageId;

            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", folderPath,
                            "public_id", imageId));

            return uploadResult.get("secure_url").toString();

        } catch (IOException e) {
            throw new AppException(ErrorCode.IMAGE_UPLOAD_FAILED);
        }
    }

    private ImageProduct uploadImageOnCloudinary(
            MultipartFile file,
            Product product) {

        String imageId = UUID.randomUUID().toString();

        String imageUrl = uploadImageCore(
                file,
                product.getId(),
                imageId);

        return ImageProduct.builder()
                .image(imageUrl)
                .product(product)
                .build();
    }

    private String uploadImageOnCloudinaryWithId(
            MultipartFile file,
            String productId,
            String imageId) {

        return uploadImageCore(file, productId, imageId);
    }

    private void deleteImageOnCloudinary(String productId, String imageId) {
        try {
            String publicId = "nckh/products/"
                    + productId
                    + "/"
                    + imageId;

            cloudinary.uploader().destroy(
                    publicId,
                    ObjectUtils.asMap("resource_type", "image"));

        } catch (Exception e) {
            throw new AppException(ErrorCode.IMAGE_DELETE_FAILED);
        }
    }

    private void deleteFolderOnCloudinary(String productId) {
        try {
            String folderPath = "nckh/products/" + productId;

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

    // sắp xếp
    private Sort buildSort(String sort) {

        if (sort == null || sort.isBlank()) {
            return Sort.by("createdAt").descending();
        }

        switch (sort) {
            case "price-asc":
                return Sort.by("finalPrice").ascending();

            case "price-desc":
                return Sort.by("finalPrice").descending();

            case "bestseller":
                return Sort.by("totalSold").descending();

            default:
                return Sort.by("createdAt").descending();
        }
    }

    // xử lý thêm, sửa, xóa specifications
    private void syncSpecifications(
            Product product,
            List<SpecificationRequest> requests) {

        Set<Specification> newSet = new HashSet<>();

        if (requests != null) {
            for (SpecificationRequest req : requests) {

                Specification spec;

                if (req.getId() != null) {
                    spec = product.getSpecifications().stream()
                            .filter(s -> s.getId() != null &&
                                    s.getId().equals(req.getId()))
                            .findFirst()
                            .orElse(new Specification());
                } else {
                    spec = new Specification();
                }

                spec.setSpecKey(req.getSpecKey());
                spec.setSpecValue(req.getSpecValue());
                spec.setDisplayOrder(req.getDisplayOrder());
                spec.setProduct(product);

                newSet.add(spec);
            }
        }

        product.getSpecifications().clear();
        product.getSpecifications().addAll(newSet);
    }

    private List<ProductListItemResponse> mapWithClient(List<Product> products) {

        if (products == null || products.isEmpty())
            return List.of();

        List<String> categoryIds = products.stream().map(Product::getCategoryId).distinct().toList();
        List<String> brandIds = products.stream().map(Product::getBrandId).distinct().toList();

        Map<String, CategoryResponse> categoryMap = categoryServiceClient.getCategoriesByIdsInternal(categoryIds);
        Map<String, BrandResponse> brandMap = brandServiceClient.getBrandsByIdsInternal(brandIds);

        return products.stream()
                .map(product -> {
                    CategoryResponse category = categoryMap.get(product.getCategoryId());
                    BrandResponse brand = brandMap.get(product.getBrandId());
                    if (category == null)
                        throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
                    if (brand == null)
                        throw new AppException(ErrorCode.BRAND_NOT_FOUND);
                    return ProductMapper.toListItemResponse(product, category, brand); // ← đổi
                })
                .toList();
    }

    private Page<ProductListItemResponse> mapPageWithClient(Page<Product> productPage) {
        List<ProductListItemResponse> responses = mapWithClient(productPage.getContent());
        return new PageImpl<>(responses, productPage.getPageable(), productPage.getTotalElements());
    }

    private ProductDetailResponse mapSingleWithClient(Product product) {
        CategoryResponse category = categoryServiceClient.getCategoryByIdInternal(product.getCategoryId());
        BrandResponse brand = brandServiceClient.getBrandByIdInternal(product.getBrandId());
        if (category == null)
            throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
        if (brand == null)
            throw new AppException(ErrorCode.BRAND_NOT_FOUND);
        return ProductMapper.toDetailResponse(product, category, brand);
    }

    private BigDecimal calculateFinalPrice(BigDecimal price, BigDecimal discount) {
        if (discount == null || discount.compareTo(BigDecimal.ZERO) <= 0) {
            return price;
        }
        return price.subtract(discount);
    }

    private List<ProductAssistantResponse> mapAssistantWithClient(List<Product> products) {
        if (products == null || products.isEmpty())
            return List.of();

        List<String> categoryIds = products.stream().map(Product::getCategoryId).distinct().toList();
        List<String> brandIds = products.stream().map(Product::getBrandId).distinct().toList();

        Map<String, CategoryResponse> categoryMap = categoryServiceClient.getCategoriesByIdsInternal(categoryIds);
        Map<String, BrandResponse> brandMap = brandServiceClient.getBrandsByIdsInternal(brandIds);

        return products.stream()
                .map(product -> {
                    CategoryResponse category = categoryMap.get(product.getCategoryId());
                    BrandResponse brand = brandMap.get(product.getBrandId());
                    return ProductMapper.toAssistantResponse(product, category, brand);
                })
                .toList();
    }

}
