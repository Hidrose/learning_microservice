package com.backend.brand_service.controller;

import java.util.List;
import java.util.Map;
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
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.domain.Page;
import com.backend.brand_service.dto.request.BrandRequest;
import com.backend.brand_service.dto.response.ApiResponse;
import com.backend.brand_service.dto.response.BrandResponse;
import com.backend.brand_service.service.BrandService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.HttpStatus;

@Validated
@RestController
@RequestMapping("/api/brand")
public class BrandController {
        private final BrandService brandService;

        public BrandController(BrandService brandService) {
                this.brandService = brandService;
        }

        @GetMapping
        public ResponseEntity<ApiResponse<List<BrandResponse>>> getBrands(
                        @RequestParam(defaultValue = "1") int page,
                        @RequestParam(defaultValue = "12") int limit,
                        @RequestParam(required = false) String q,
                        @RequestParam(required = false) Integer status) {

                Page<BrandResponse> brandPage = brandService.getBrands(page, limit, q, status);

                return ResponseEntity.ok(
                                ApiResponse.<List<BrandResponse>>builder()
                                                .message("Lấy danh sách thương hiệu thành công")
                                                .data(brandPage.getContent())
                                                .totalPages(brandPage.getTotalPages())
                                                .total(brandPage.getTotalElements())
                                                .build());
        }

        @GetMapping("/all")
        public ResponseEntity<ApiResponse<List<BrandResponse>>> getAllBrands() {
                return ResponseEntity.ok(
                                ApiResponse.<List<BrandResponse>>builder()
                                                .message("Lấy tất cả thương hiệu thành công")
                                                .data(brandService.getAllBrands())
                                                .build());
        }

        @GetMapping("/active")
        public ResponseEntity<ApiResponse<List<BrandResponse>>> getActiveBrands() {
                return ResponseEntity.ok(
                                ApiResponse.<List<BrandResponse>>builder()
                                                .message("Lấy thương hiệu active thành công")
                                                .data(brandService.getActiveBrands())
                                                .build());
        }

        @GetMapping("/{id}")
        public ResponseEntity<ApiResponse<BrandResponse>> getBrandById(@PathVariable String id) {
                return ResponseEntity.ok(
                                ApiResponse.<BrandResponse>builder()
                                                .message("Lấy chi tiết thương hiệu thành công")
                                                .data(brandService.getBrandById(id))
                                                .build());
        }

        @PostMapping
        public ResponseEntity<ApiResponse<Void>> createBrand(
                        @Valid @RequestBody BrandRequest request) {
                brandService.createBrand(request);
                return ResponseEntity.status(HttpStatus.CREATED)
                                .body(ApiResponse.<Void>builder()
                                                .message("Tạo thương hiệu thành công")
                                                .build());
        }

        @PutMapping("/{id}")
        public ResponseEntity<ApiResponse<Void>> updateBrand(
                        @PathVariable String id,
                        @Valid @RequestBody BrandRequest request) {
                brandService.updateBrand(id, request);
                return ResponseEntity.ok(
                                ApiResponse.<Void>builder()
                                                .message("Cập nhật thương hiệu thành công")
                                                .build());
        }

        @PatchMapping("/status/{id}")
        public ResponseEntity<ApiResponse<Void>> updateBrandStatus(
                        @PathVariable String id,
                        @RequestParam @NotNull Integer status) {
                brandService.updateBrandStatus(id, status);
                return ResponseEntity.ok(
                                ApiResponse.<Void>builder()
                                                .message("Cập nhật trạng thái thành công")
                                                .build());
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<ApiResponse<Void>> deleteBrand(@PathVariable String id) {
                brandService.deleteBrand(id);
                return ResponseEntity.ok(
                                ApiResponse.<Void>builder()
                                                .message("Xóa thương hiệu thành công")
                                                .build());
        }

        // assistant
        @GetMapping("/assistant")
        public ResponseEntity<List<BrandResponse>> getBrandsAssistant(
                        @RequestParam(defaultValue = "12") int limit,
                        @RequestParam(required = false) String q,
                        @RequestParam(required = false) Integer status) {

                Page<BrandResponse> brandPage = brandService.getBrands(1, limit, q, status);

                return ResponseEntity.ok(brandPage.getContent());
        }

        // internal
        @GetMapping("/internal/slug/{slug}")
        public ResponseEntity<BrandResponse> getBrandBySlugInternal(@PathVariable String slug) {
                return ResponseEntity.ok(brandService.getBrandBySlug(slug));
        }

        @GetMapping("/internal/{id}")
        public ResponseEntity<BrandResponse> getBrandByIdInternal(@PathVariable String id) {
                return ResponseEntity.ok(brandService.getBrandById(id));
        }

        @PostMapping("/internal/brands")
        public Map<String, BrandResponse> getBrandsByIdsInternal(
                        @RequestBody List<String> ids) {

                return brandService.getBrandsByIds(ids);
        }
}
