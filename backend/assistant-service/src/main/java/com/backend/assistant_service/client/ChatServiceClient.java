package com.backend.assistant_service.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.backend.assistant_service.dto.request.MessageRequest;
import com.backend.assistant_service.dto.response.MessageResponse;

@FeignClient(name = "chat-service")
public interface ChatServiceClient {

        @PostMapping("/api/chat/internal/user/message/{userId}")
        String sendUserMessage(
                        @PathVariable("userId") String userId,
                        @RequestBody MessageRequest request);

        @PostMapping("/api/chat/internal/assistant/message")
        void saveAssistantMessage(@RequestBody MessageRequest request);

        @GetMapping("/api/chat/internal/user/{userId}")
        List<MessageResponse> getChatMessagesInternal(
                        @PathVariable String userId,
                        @RequestParam(defaultValue = "1") int page,
                        @RequestParam(defaultValue = "20") int limit);
}
