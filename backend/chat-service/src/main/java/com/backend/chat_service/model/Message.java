package com.backend.chat_service.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
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

    private boolean isBot; // true nếu là trợ lý ảo, false nếu là user
    private String content; // nội dung tin nhắn

    @Builder.Default
    private List<String> products = new ArrayList<>();

    @Builder.Default
    private Map<String, Object> extraData = new HashMap<>();

    @CreatedDate
    private LocalDateTime createdAt;
}
