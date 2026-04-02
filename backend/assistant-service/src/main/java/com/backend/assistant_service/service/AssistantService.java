package com.backend.assistant_service.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.backend.assistant_service.client.ChatServiceClient;
import com.backend.assistant_service.dto.request.MessageRequest;
import com.backend.assistant_service.dto.response.AssistantResponse;
import com.backend.assistant_service.dto.response.MessageResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class AssistantService {
        private final ChatServiceClient chatServiceClient;
        private final WebClient webClient;

        @Value("${n8n.webhook}")
        private String webhookPath;

        public AssistantService(ChatServiceClient chatServiceClient,
                        WebClient.Builder builder,
                        @Value("${n8n.url}") String n8nUrl) {

                this.chatServiceClient = chatServiceClient;

                this.webClient = builder
                                .baseUrl(n8nUrl)
                                .build();
        }

        public void handleChat(String userId, String token, MessageRequest request) {
                // Lưu tin nhắn của người dùng
                String chatId = chatServiceClient.sendUserMessage(userId, request);

                // Lấy history messages của người dùng
                List<MessageResponse> messages = chatServiceClient.getChatMessagesInternal(userId, 1, 20);

                AssistantResponse aiResponse = callAI(chatId, userId, token, messages, request.getContent());

                if (aiResponse == null || aiResponse.getContent() == null) {
                        aiResponse = AssistantResponse.builder()
                                        .content("Xin lỗi, có lỗi xảy ra khi xử lý phản hồi.")
                                        .productIds(List.of())
                                        .build();
                }

                // lưu tin nhắn của trợ lý ảo
                chatServiceClient.saveAssistantMessage(MessageRequest.builder()
                                .chatId(chatId)
                                .content(aiResponse.getContent())
                                .productIds(aiResponse.getProductIds())
                                .build());
        }

        private AssistantResponse callAI(String chatId, String userId, String token, List<MessageResponse> messages,
                        String currentMessage) {
                List<Map<String, String>> history = messages.stream()
                                .map(m -> Map.of(
                                                "role", mapRole(m.getRole()),
                                                "content", m.getContent()))
                                .toList();

                Map<String, Object> body = Map.of(
                                "chatId", chatId,
                                "userId", userId,
                                "token", token,
                                "chatInput", currentMessage,
                                "messages", history);

                String rawResponse = webClient.post()
                                .uri(webhookPath)
                                .bodyValue(body)
                                .retrieve()
                                .bodyToMono(String.class)
                                .block();

                System.out.println("n8n raw response: " + rawResponse);

                if (rawResponse == null) {
                        return AssistantResponse.builder()
                                        .content("Xin lỗi, trợ lý không phản hồi được lúc này.")
                                        .productIds(List.of())
                                        .build();
                }

                try {
                        ObjectMapper mapper = new ObjectMapper();
                        JsonNode root = mapper.readTree(rawResponse);
                        JsonNode node = root.isArray() ? root.get(0) : root;
                        return mapper.treeToValue(node, AssistantResponse.class);
                } catch (Exception e) {
                        System.out.println("Parse error: " + e.getMessage());
                        return AssistantResponse.builder()
                                        .content("Xin lỗi, trợ lý không phản hồi được lúc này.")
                                        .productIds(List.of())
                                        .build();
                }
        }

        private String mapRole(String role) {
                return switch (role) {
                        case "USER" -> "user";
                        case "ASSISTANT" -> "assistant";
                        default -> "user";
                };
        }

}