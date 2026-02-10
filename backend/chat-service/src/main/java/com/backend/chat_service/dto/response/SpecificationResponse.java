package com.backend.chat_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpecificationResponse {
    private String id;
    private String specKey;
    private String specValue;
    private Integer displayOrder;
}
