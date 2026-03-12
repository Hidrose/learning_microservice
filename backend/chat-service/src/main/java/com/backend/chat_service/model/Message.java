package com.backend.chat_service.model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "message")
public class Message {
    @Id
    private String id;

    @Indexed
    private String chatId;

    private String role; // USER, ASSISTANT
    private String content; // nội dung tin nhắn

    private String intent; // ý định của người dùng

    private List<String> productIds;

    private Map<String, Object> extraData;

    @CreatedDate
    private LocalDateTime createdAt;
}
