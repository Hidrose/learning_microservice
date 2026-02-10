package com.backend.product_service.controller;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.backend.product_service.dto.request.ProductRequest;
import com.backend.product_service.dto.request.StockRequest;
import com.backend.product_service.dto.response.ProductResponse;
import com.backend.product_service.service.ProductService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Validated
@RestController
@RequestMapping("/api/product")
public class ProductController {

        private final ProductService productService;

        public ProductController(ProductService productService) {
                this.productService = productService;
        }

        @GetMapping
        public ResponseEntity<?> getAllProducts(
                        @RequestParam(defaultValue = "1") int page,
                        @RequestParam(defaultValue = "12") int limit,
                        @RequestParam(required = false) String q,
                        @RequestParam(required = false) Integer status) {

                Page<ProductResponse> productPage = productService.getAllProducts(page, limit, q, status);

                return ResponseEntity.ok(
                                Map.of(
                                                "products", productPage.getContent(),
                                                "totalPages", productPage.getTotalPages(),
                                                "total", productPage.getTotalElements()));
        }

        @GetMapping("/{id}")
        public ResponseEntity<ProductResponse> getProductById(
                        @PathVariable String id) {

                return ResponseEntity.ok(productService.getProductById(id));
        }

        @PostMapping(consumes = "multipart/form-data")
        public ResponseEntity<ProductResponse> createProduct(
                        @Valid @RequestPart("product") ProductRequest request,
                        @RequestPart(value = "images", required = false) List<MultipartFile> images) {

                return ResponseEntity.ok(
                                productService.createProduct(request, images));
        }

        @PutMapping(value = "/{id}", consumes = "multipart/form-data")
        public ResponseEntity<ProductResponse> updateProduct(
                        @PathVariable String id,
                        @Valid @RequestPart("product") ProductRequest request,
                        @RequestPart(value = "images", required = false) List<MultipartFile> images) {

                return ResponseEntity.ok(
                                productService.updateProduct(id, request, images));
        }

        @PatchMapping("/status/{id}")
        public ResponseEntity<ProductResponse> updateProductStatus(
                        @PathVariable String id,
                        @RequestParam @NotNull Integer status) {

                return ResponseEntity.ok(
                                productService.updateProductStatus(id, status));
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<Void> deleteProduct(
                        @PathVariable String id) {

                productService.deleteProduct(id);
                return ResponseEntity.noContent().build();
        }

        @DeleteMapping("/{productId}/image/{imageId}")
        public ResponseEntity<Void> deleteImage(
                        @PathVariable String productId,
                        @PathVariable String imageId) {

                productService.deleteProductImage(productId, imageId);
                return ResponseEntity.noContent().build();
        }

        @GetMapping("/active")
        public ResponseEntity<?> getActiveProducts(
                        @RequestParam(defaultValue = "1") int page,
                        @RequestParam(defaultValue = "12") int limit,
                        @RequestParam(required = false) String q,
                        @RequestParam(required = false) String sort) {

                Page<ProductResponse> productPage = productService.getActiveProducts(page, limit, q, sort);

                return ResponseEntity.ok(
                                Map.of(
                                                "products", productPage.getContent(),
                                                "totalPages", productPage.getTotalPages(),
                                                "total", productPage.getTotalElements()));
        }

        @GetMapping("/active/category/{slug}")
        public ResponseEntity<?> getActiveProductsByCategory(
                        @PathVariable String slug,
                        @RequestParam(defaultValue = "1") int page,
                        @RequestParam(defaultValue = "12") int limit,
                        @RequestParam(required = false) String q,
                        @RequestParam(required = false) String sort) {

                Page<ProductResponse> productPage = productService.getActiveProductsByCategory(page, limit, q, sort,
                                slug);

                return ResponseEntity.ok(
                                Map.of(
                                                "products", productPage.getContent(),
                                                "totalPages", productPage.getTotalPages(),
                                                "total", productPage.getTotalElements()));
        }

        @GetMapping("/active/discount")
        public ResponseEntity<?> getActiveDiscountProducts(
                        @RequestParam(defaultValue = "1") int page,
                        @RequestParam(defaultValue = "12") int limit,
                        @RequestParam(required = false) String q,
                        @RequestParam(required = false) String sort) {

                Page<ProductResponse> productPage = productService.getActiveDiscountProducts(page, limit, q, sort);

                return ResponseEntity.ok(
                                Map.of(
                                                "products", productPage.getContent(),
                                                "totalPages", productPage.getTotalPages(),
                                                "total", productPage.getTotalElements()));
        }

        @GetMapping("/active/bestseller")
        public ResponseEntity<List<ProductResponse>> getActiveBestSellerProducts(
                        @RequestParam(required = false) Integer limit) {
                return ResponseEntity.ok(
                                productService.getActiveBestSellerProducts(limit));
        }

        @GetMapping("/active/limit")
        public ResponseEntity<List<ProductResponse>> getActiveLimitProducts(
                        @RequestParam(required = false) String q,
                        @RequestParam(required = false) Integer limit) {
                return ResponseEntity.ok(
                                productService.getActiveLimitProducts(q, limit));
        }

        @GetMapping("/active/slug/{slug}")
        public ResponseEntity<ProductResponse> getActiveProductBySlug(
                        @PathVariable String slug) {

                return ResponseEntity.ok(productService.getActiveProductBySlug(slug));
        }

        @PatchMapping(value = "/{productId}/image/{imageId}", consumes = "multipart/form-data")
        public ResponseEntity<Void> updateProductImage(
                        @PathVariable String productId,
                        @PathVariable String imageId,
                        @RequestPart("file") MultipartFile file) {
                productService.updateProductImage(productId, imageId, file);
                return ResponseEntity.noContent().build();
        }

        // internal
        @GetMapping("/internal/category/{categoryId}")
        public ResponseEntity<List<ProductResponse>> getAllActiveProductsByCategoryIdInternal(
                        @PathVariable String categoryId) {

                return ResponseEntity.ok(
                                productService.getAllActiveProductsByCategoryId(categoryId));
        }

        @GetMapping("/internal/brand/{brandId}")
        public ResponseEntity<List<ProductResponse>> getAllActiveProductsByBrandIdInternal(
                        @PathVariable String brandId) {

                return ResponseEntity.ok(
                                productService.getAllActiveProductsByBrandId(brandId));
        }

        @GetMapping("/internal/active/{id}")
        public ResponseEntity<ProductResponse> getActiveProductById(
                        @PathVariable String id) {

                return ResponseEntity.ok(productService.getActiveProductById(id));
        }

        @GetMapping("/internal/exist/brand/{brandId}")
        public ResponseEntity<Boolean> existsProductByBrandIdInternal(
                        @PathVariable String brandId) {

                return ResponseEntity.ok(
                                productService.existsProductByBrandId(brandId));
        }

        @GetMapping("/internal/exist/category/{categoryId}")
        public ResponseEntity<Boolean> existsProductByCategoryIdInternal(
                        @PathVariable String categoryId) {

                return ResponseEntity.ok(
                                productService.existsProductByCategoryId(categoryId));
        }

        @PostMapping("/internal/products")
        public List<ProductResponse> getProductsByIdsInternal(
                        @RequestBody List<String> ids) {

                return productService.getProductsByIds(ids);
        }

        @PostMapping("/internal/decrease")
        public ResponseEntity<Void> decreaseStockInternal(
                        @RequestBody List<StockRequest> requests) {

                productService.decreaseStock(requests);
                return ResponseEntity.ok().build();
        }

        @PostMapping("/internal/increase")
        public ResponseEntity<Void> increaseStockInternal(
                        @RequestBody List<StockRequest> requests) {

                productService.increaseStock(requests);
                return ResponseEntity.ok().build();
        }

        @PostMapping("/internal/status/brand/{brandId}")
        public ResponseEntity<Void> hideProductsByBrandInternal(
                        @PathVariable String brandId) {

                productService.hideProductsByBrandId(brandId);
                return ResponseEntity.noContent().build();
        }

        @PostMapping("/internal/status/category/{categoryId}")
        public ResponseEntity<Void> hideProductsByCategoryInternal(
                        @PathVariable String categoryId) {

                productService.hideProductsByCategoryId(categoryId);
                return ResponseEntity.noContent().build();
        }

}
