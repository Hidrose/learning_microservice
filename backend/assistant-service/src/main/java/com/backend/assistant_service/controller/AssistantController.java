package com.backend.assistant_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.assistant_service.dto.request.MessageRequest;
import com.backend.assistant_service.dto.response.ApiResponse;
import com.backend.assistant_service.service.AssistantService;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

@RestController
@RequestMapping("/api/assistant")
public class AssistantController {

    private final AssistantService assistantService;

    public AssistantController(AssistantService assistantService) {
        this.assistantService = assistantService;
    }

    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<Void>> handleChat(
            @AuthenticationPrincipal String userId,
            @RequestHeader("Authorization") String authHeader, 
            @Valid @RequestBody MessageRequest request) {

        String token = authHeader.replace("Bearer ", ""); 
        assistantService.handleChat(userId, token, request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<Void>builder()
                        .message("Gửi tin nhắn đến trợ lý thành công")
                        .build());
    }

}