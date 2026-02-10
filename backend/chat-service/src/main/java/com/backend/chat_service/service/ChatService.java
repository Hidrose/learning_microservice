package com.backend.chat_service.service;

import org.springframework.stereotype.Service;

import com.backend.chat_service.repository.ChatRepository;

@Service
public class ChatService {
    private final ChatRepository chatRepository;

    public ChatService(ChatRepository chatRepository) {
        this.chatRepository = chatRepository;
    }
}
