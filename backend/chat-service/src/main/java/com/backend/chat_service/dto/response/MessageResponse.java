package com.backend.chat_service.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageResponse {
    private String id;
    private String chatId;
    private String role;
    private String content;
    private List<ProductListItemResponse> products;
    private LocalDateTime createdAt;
}
