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
public class ChatResponse {
    private String id;
    private String userId;
    private Map<String, Object> sessionData;
    private List<MessageResponse> messages;
    private LocalDateTime createdAt;
}
