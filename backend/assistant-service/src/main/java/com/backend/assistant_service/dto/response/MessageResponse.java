package com.backend.assistant_service.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
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
    private boolean isBot;
    private String content;
    private List<String> products;
    private Map<String, Object> extraData;
    private LocalDateTime createdAt;
}
