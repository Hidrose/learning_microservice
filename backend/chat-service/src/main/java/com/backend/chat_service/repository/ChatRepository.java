package com.backend.chat_service.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.backend.chat_service.model.Chat;

@Repository
public interface ChatRepository extends MongoRepository<Chat, String> {

}
