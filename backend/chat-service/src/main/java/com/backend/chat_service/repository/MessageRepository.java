package com.backend.chat_service.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;
import com.backend.chat_service.model.Message;

@Repository
public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findByChatIdOrderByCreatedAtAsc(String chatId);

    void deleteByChatId(String chatId);

    Page<Message> findByChatId(String chatId, Pageable pageable);
}