package com.backend.category_service.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.category_service.entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, String> {
    Optional<Category> findBySlug(String slug);

    Optional<Category> findByName(String name);

    List<Category> findByStatus(Integer status);

    Page<Category> findByNameContainingIgnoreCase(String q, Pageable pageable);

    Page<Category> findByStatus(Integer status, Pageable pageable);

    Page<Category> findByNameContainingIgnoreCaseAndStatus(
            String q, Integer status, Pageable pageable);

    boolean existsByName(String name);
}
