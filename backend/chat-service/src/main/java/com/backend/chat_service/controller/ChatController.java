package com.backend.chat_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.chat_service.dto.request.MessageRequest;
import com.backend.chat_service.dto.response.ApiResponse;
import com.backend.chat_service.dto.response.MessageResponse;
import com.backend.chat_service.service.ChatService;

import jakarta.validation.Valid;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

@Validated
@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/user")
    public ResponseEntity<ApiResponse<List<MessageResponse>>> getChatMessages(
            @AuthenticationPrincipal String userId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit) {

        Page<MessageResponse> messagePage = chatService.getMessages(userId, page, limit);

        return ResponseEntity.ok(
                ApiResponse.<List<MessageResponse>>builder()
                        .message("Lấy tin nhắn thành công")
                        .data(messagePage.getContent())
                        .totalPages(messagePage.getTotalPages())
                        .total(messagePage.getTotalElements())
                        .build());
    }

    // internal
    @PostMapping("/internal/user/message/{userId}")
    public ResponseEntity<String> sendUserMessage(
            @PathVariable String userId,
            @Valid @RequestBody MessageRequest messageRequest) {

        String chatId = chatService.saveMessage(messageRequest, userId, "USER");
        return ResponseEntity.status(HttpStatus.CREATED).body(chatId);
    }

    @PostMapping("/internal/assistant/message")
    public ResponseEntity<Void> saveAssistantMessage(
            @Valid @RequestBody MessageRequest messageRequest) {
        chatService.saveMessage(messageRequest, null, "ASSISTANT");
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/internal/user/{userId}")
    public ResponseEntity<List<MessageResponse>> getChatMessagesInternal(
            @PathVariable String userId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit) {

        Page<MessageResponse> messagePage = chatService.getMessages(userId, page, limit);

        return ResponseEntity.ok(messagePage.getContent());
    }
}