package com.backend.category_service.controller;

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

import com.backend.category_service.dto.request.CategoryRequest;
import com.backend.category_service.dto.response.ApiResponse;
import com.backend.category_service.dto.response.CategoryResponse;
import com.backend.category_service.service.CategoryService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.HttpStatus;

@Validated
@RestController
@RequestMapping("/api/category")
public class CategoryController {
        private final CategoryService categoryService;

        public CategoryController(CategoryService categoryService) {
                this.categoryService = categoryService;
        }

        @GetMapping
        public ResponseEntity<ApiResponse<List<CategoryResponse>>> getCategories(
                        @RequestParam(defaultValue = "1") int page,
                        @RequestParam(defaultValue = "12") int limit,
                        @RequestParam(required = false) String q,
                        @RequestParam(required = false) Integer status) {

                Page<CategoryResponse> categoryPage = categoryService.getCategories(page, limit, q, status);

                return ResponseEntity.ok(
                                ApiResponse.<List<CategoryResponse>>builder()
                                                .message("Lấy danh sách danh mục thành công")
                                                .data(categoryPage.getContent())
                                                .totalPages(categoryPage.getTotalPages())
                                                .total(categoryPage.getTotalElements())
                                                .build());
        }

        @GetMapping("/all")
        public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories() {
                return ResponseEntity.ok(
                                ApiResponse.<List<CategoryResponse>>builder()
                                                .message("Lấy tất cả danh mục thành công")
                                                .data(categoryService.getAllCategories())
                                                .build());
        }

        @GetMapping("/{id}")
        public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(
                        @PathVariable String id) {
                return ResponseEntity.ok(
                                ApiResponse.<CategoryResponse>builder()
                                                .message("Lấy chi tiết danh mục thành công")
                                                .data(categoryService.getCategoryById(id))
                                                .build());
        }

        @PostMapping(consumes = "multipart/form-data")
        public ResponseEntity<ApiResponse<Void>> createCategory(
                        @Valid @RequestPart("category") CategoryRequest request,
                        @RequestPart(value = "image", required = false) MultipartFile image) {
                categoryService.createCategory(request, image);
                return ResponseEntity.status(HttpStatus.CREATED)
                                .body(ApiResponse.<Void>builder()
                                                .message("Tạo danh mục thành công")
                                                .build());
        }

        @PutMapping(value = "/{id}", consumes = "multipart/form-data")
        public ResponseEntity<ApiResponse<Void>> updateCategory(
                        @PathVariable String id,
                        @Valid @RequestPart("category") CategoryRequest request,
                        @RequestPart(value = "image", required = false) MultipartFile image) {
                categoryService.updateCategory(id, request, image);
                return ResponseEntity.ok(
                                ApiResponse.<Void>builder()
                                                .message("Cập nhật danh mục thành công")
                                                .build());
        }

        @PatchMapping("/status/{id}")
        public ResponseEntity<ApiResponse<Void>> updateStatusCategory(
                        @PathVariable String id,
                        @RequestParam @NotNull Integer status) {
                categoryService.updateCategoryStatus(id, status);
                return ResponseEntity.ok(
                                ApiResponse.<Void>builder()
                                                .message("Cập nhật trạng thái thành công")
                                                .build());
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable String id) {
                categoryService.deleteCategory(id);
                return ResponseEntity.ok(
                                ApiResponse.<Void>builder()
                                                .message("Xóa danh mục thành công")
                                                .build());
        }

        @GetMapping("/active")
        public ResponseEntity<ApiResponse<List<CategoryResponse>>> getActiveCategories() {
                return ResponseEntity.ok(
                                ApiResponse.<List<CategoryResponse>>builder()
                                                .message("Lấy danh mục active thành công")
                                                .data(categoryService.getActiveCategories())
                                                .build());
        }

        // trọ lý ảo
        @GetMapping("/assistant")
        public ResponseEntity<List<CategoryResponse>> getCategoriesAssistant(
                        @RequestParam(defaultValue = "12") int limit,
                        @RequestParam(required = false) String q,
                        @RequestParam(required = false) Integer status) {

                Page<CategoryResponse> categoryPage = categoryService.getCategories(1, limit, q, status);

                return ResponseEntity.ok(categoryPage.getContent());
        }

        // internal
        @GetMapping("/internal/slug/{slug}")
        public ResponseEntity<CategoryResponse> getCategoryBySlugInternal(@PathVariable String slug) {
                return ResponseEntity.ok(categoryService.getCategoryBySlug(slug));
        }

        @GetMapping("/internal/{id}")
        public ResponseEntity<CategoryResponse> getCategoryByIdInternal(@PathVariable String id) {
                return ResponseEntity.ok(categoryService.getCategoryById(id));
        }

        @PostMapping("/internal/categories")
        public Map<String, CategoryResponse> getCategoriesByIdsInternal(
                        @RequestBody List<String> ids) {

                return categoryService.getCategoriesByIds(ids);
        }
}
