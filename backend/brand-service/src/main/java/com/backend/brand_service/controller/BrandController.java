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
import com.backend.brand_service.dto.response.BrandResponse;
import com.backend.brand_service.service.BrandService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Validated
@RestController
@RequestMapping("/api/brand")
public class BrandController {
    private final BrandService brandService;

    public BrandController(BrandService brandService) {
        this.brandService = brandService;
    }

    @GetMapping
    public ResponseEntity<?> getBrands(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int limit,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Integer status) {

        Page<BrandResponse> brandPage = brandService.getBrands(page, limit, q, status);

        return ResponseEntity.ok(
                Map.of(
                        "brands", brandPage.getContent(),
                        "totalPages", brandPage.getTotalPages(),
                        "total", brandPage.getTotalElements()));
    }

    @GetMapping("/all")
    public ResponseEntity<List<BrandResponse>> getAllBrands() {
        return ResponseEntity.ok(brandService.getAllBrands());
    }

    @GetMapping("/active")
    public ResponseEntity<List<BrandResponse>> getActiveBrands() {
        return ResponseEntity.ok(brandService.getActiveBrands());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BrandResponse> getBrandById(@PathVariable String id) {
        return ResponseEntity.ok(brandService.getBrandById(id));
    }

    @PostMapping
    public ResponseEntity<BrandResponse> createBrand(
            @Valid @RequestBody BrandRequest request) {

        return ResponseEntity.ok(brandService.createBrand(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BrandResponse> updateBrand(
            @PathVariable String id,
            @Valid @RequestBody BrandRequest request) {

        return ResponseEntity.ok(brandService.updateBrand(id, request));
    }

    @PatchMapping("/status/{id}")
    public ResponseEntity<BrandResponse> updateBrandStatus(
            @PathVariable String id,
            @RequestParam @NotNull Integer status) {

        return ResponseEntity.ok(
                brandService.updateBrandStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBrand(@PathVariable String id) {
        brandService.deleteBrand(id);
        return ResponseEntity.noContent().build();
    }

    // internal
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
