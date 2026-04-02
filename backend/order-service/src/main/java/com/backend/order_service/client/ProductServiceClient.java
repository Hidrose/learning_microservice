package com.backend.order_service.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.backend.order_service.dto.request.StockRequest;
import com.backend.order_service.dto.response.ProductListItemResponse;

@FeignClient(name = "product-service")
public interface ProductServiceClient {
    @PostMapping("/api/product/internal/products")
    List<ProductListItemResponse> getProductsByIdsInternal(@RequestBody List<String> ids);

    @PostMapping("/api/product/internal/decrease")
    void decreaseStockInternal(@RequestBody List<StockRequest> requests);

    @PostMapping("/api/product/internal/increase")
    void increaseStockInternal(@RequestBody List<StockRequest> requests);
}
