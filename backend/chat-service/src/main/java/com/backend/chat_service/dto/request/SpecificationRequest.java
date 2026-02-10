package com.backend.chat_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpecificationRequest {
    private String id;

    @NotBlank(message = "Spec key không được để trống")
    private String specKey;

    @NotBlank(message = "Spec value không được để trống")
    private String specValue;

    private Integer displayOrder;
}
