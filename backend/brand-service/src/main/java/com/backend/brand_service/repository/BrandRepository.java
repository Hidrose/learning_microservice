package com.backend.brand_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.backend.brand_service.entity.Brand;

@Repository
public interface BrandRepository extends JpaRepository<Brand, String> {
    Optional<Brand> findByName(String name);

    List<Brand> findByStatus(Integer status);

    Page<Brand> findByNameContainingIgnoreCase(String q, Pageable pageable);

    Page<Brand> findByStatus(Integer status, Pageable pageable);

    Page<Brand> findByNameContainingIgnoreCaseAndStatus(
            String q, Integer status, Pageable pageable);

    boolean existsByName(String name);
}
