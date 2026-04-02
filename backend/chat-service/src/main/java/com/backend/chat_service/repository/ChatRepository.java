package com.backend.chat_service.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.backend.chat_service.model.Chat;

@Repository
public interface ChatRepository extends MongoRepository<Chat, String> {
    List<Chat> findByUserIdOrderByCreatedAtDesc(String userId);

    Optional<Chat> findByIdAndUserId(String id, String userId);

    Optional<Chat> findByUserId(String userId);
}
