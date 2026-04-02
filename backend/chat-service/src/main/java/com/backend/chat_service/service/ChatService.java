package com.backend.chat_service.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.backend.chat_service.client.ProductServiceClient;
import com.backend.chat_service.dto.request.MessageRequest;
import com.backend.chat_service.dto.response.MessageResponse;
import com.backend.chat_service.dto.response.ProductListItemResponse;
import com.backend.chat_service.exception.AppException;
import com.backend.chat_service.exception.ErrorCode;
import com.backend.chat_service.mapper.ChatMapper;
import com.backend.chat_service.model.Chat;
import com.backend.chat_service.model.Message;
import com.backend.chat_service.repository.ChatRepository;
import com.backend.chat_service.repository.MessageRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@Service
public class ChatService {

        private final ChatRepository chatRepository;
        private final MessageRepository messageRepository;
        private final ProductServiceClient productServiceClient;

        public ChatService(ChatRepository chatRepository,
                        MessageRepository messageRepository,
                        ProductServiceClient productServiceClient) {
                this.chatRepository = chatRepository;
                this.messageRepository = messageRepository;
                this.productServiceClient = productServiceClient;
        }

        // Lấy messages của user
        public Page<MessageResponse> getMessages(String userId, int page, int limit) {
                Chat chat = chatRepository.findByUserId(userId)
                                .orElseThrow(() -> new AppException(ErrorCode.CHAT_NOT_FOUND));

                Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());

                return messageRepository.findByChatId(chat.getId(), pageable)
                                .map(this::mapMessageWithProducts);
        }

        // Lưu tin nhắn với role được truyền vào (USER hoặc ASSISTANT)
        public String saveMessage(MessageRequest request, String userId, String role) {
                Chat chat = userId != null
                                ? chatRepository.findByUserId(userId)
                                                .orElseGet(() -> chatRepository.save(
                                                                Chat.builder().userId(userId).build()))
                                : chatRepository.findById(request.getChatId())
                                                .orElseThrow(() -> new AppException(ErrorCode.CHAT_NOT_FOUND));

                Message message = ChatMapper.toMessageEntity(request, chat.getId(), role);
                messageRepository.save(message);
                return chat.getId();
        }

        private MessageResponse mapMessageWithProducts(Message message) {
                if (message.getProductIds() != null && !message.getProductIds().isEmpty()) {
                        List<ProductListItemResponse> products = productServiceClient
                                        .getProductsByIdsInternal(message.getProductIds());
                        return ChatMapper.toMessageResponse(message, products);
                }
                return ChatMapper.toMessageResponse(message, List.of());
        }
}