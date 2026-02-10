package com.backend.order_service.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.backend.order_service.config.InternalFeignConfig;
import com.backend.order_service.dto.request.StockRequest;
import com.backend.order_service.dto.response.ProductResponse;

@FeignClient(name = "product-service", configuration = InternalFeignConfig.class)
public interface ProductServiceClient {
    @PostMapping("/api/product/internal/products")
    List<ProductResponse> getProductsByIdsInternal(@RequestBody List<String> ids);

    @PostMapping("/api/product/internal/stock/decrease")
    void decreaseStockInternal(@RequestBody List<StockRequest> requests);

    @PostMapping("/api/product/internal/stock/increase")
    void increaseStockInternal(@RequestBody List<StockRequest> requests);
}
