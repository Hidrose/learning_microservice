package com.backend.chat_service.dto.request;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageRequest {
    private String chatId;

    @NotBlank(message = "Nội dung tin nhắn không được để trống")
    private String content;

    private List<String> productIds;
}
