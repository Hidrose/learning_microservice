package com.backend.product_service.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.backend.product_service.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {

    @EntityGraph(attributePaths = { "images", "specifications" })
    Page<Product> findByNameContainingIgnoreCaseAndStatus(
            String name,
            Integer status,
            Pageable pageable);

    @EntityGraph(attributePaths = { "images", "specifications" })
    Page<Product> findByNameContainingIgnoreCase(
            String name,
            Pageable pageable);

    @EntityGraph(attributePaths = { "images", "specifications" })
    Page<Product> findByStatus(
            Integer status,
            Pageable pageable);

    @EntityGraph(attributePaths = { "images", "specifications" })
    Page<Product> findByStatusAndNameContainingIgnoreCase(
            Integer status,
            String name,
            Pageable pageable);

    @EntityGraph(attributePaths = { "images", "specifications" })
    List<Product> findByStatus(
            Integer status,
            Sort sort);

    @EntityGraph(attributePaths = { "images", "specifications" })
    List<Product> findByStatusAndTotalSoldGreaterThan(
            Integer status,
            Integer totalSold,
            Sort sort);

    boolean existsByName(String name);

    @EntityGraph(attributePaths = { "images", "specifications" })
    Optional<Product> findByIdAndStatus(String id, int i);

    @EntityGraph(attributePaths = { "images", "specifications" })
    Optional<Product> findByName(String name);

    @EntityGraph(attributePaths = { "images", "specifications" })
    Page<Product> findByStatusAndCategoryId(
            int status,
            String categoryId,
            Pageable pageable);

    @EntityGraph(attributePaths = { "images", "specifications" })
    Page<Product> findByStatusAndCategoryIdAndNameContainingIgnoreCase(
            int status,
            String categoryId,
            String name,
            Pageable pageable);

    boolean existsByBrandId(String brandId);

    boolean existsByCategoryId(String categoryId);

    @EntityGraph(attributePaths = { "images", "specifications" })
    List<Product> findByStatusAndCategoryId(
            Integer status,
            String categoryId,
            Sort sort);

    @EntityGraph(attributePaths = { "images", "specifications" })
    List<Product> findByStatusAndBrandId(
            Integer status,
            String brandId,
            Sort sort);

    @EntityGraph(attributePaths = { "images", "specifications" })
    List<Product> findByIdInAndStatus(List<String> ids, Integer status);

    @EntityGraph(attributePaths = { "images", "specifications" })
    Page<Product> findByStatusAndDiscountGreaterThan(
            Integer status,
            BigDecimal discount,
            Pageable pageable);

    @EntityGraph(attributePaths = { "images", "specifications" })
    Page<Product> findByStatusAndDiscountGreaterThanAndNameContainingIgnoreCase(
            Integer status,
            BigDecimal discount,
            String name,
            Pageable pageable);

    @EntityGraph(attributePaths = { "images", "specifications" })
    Page<Product> findByStatusAndTotalSoldGreaterThan(
            int status,
            int totalSold,
            Pageable pageable);

    @EntityGraph(attributePaths = { "images", "specifications" })
    List<Product> findTop10ByStatusOrderByCreatedAtDesc(int status);

    @EntityGraph(attributePaths = { "images", "specifications" })
    Optional<Product> findBySlugAndStatus(String slug, int status);

    @EntityGraph(attributePaths = { "images", "specifications" })
    @Query("""
                SELECT p FROM Product p
                WHERE p.status = 1
                  AND LOWER(p.name) LIKE LOWER(CONCAT('%', :q, '%'))
            """)
    List<Product> searchActiveProducts(
            @Param("q") String q,
            Pageable pageable);

    @Modifying
    @Query("""
                UPDATE Product p
                SET p.status = :status
                WHERE p.brandId = :brandId
            """)
    int updateStatusByBrandId(String brandId, Integer status);

    @Modifying
    @Query("""
                UPDATE Product p
                SET p.status = :status
                WHERE p.categoryId = :categoryId
            """)
    int updateStatusByCategoryId(String categoryId, Integer status);

    @EntityGraph(attributePaths = { "images", "specifications" })
    @Override
    Optional<Product> findById(String id);

    @EntityGraph(attributePaths = { "images", "specifications" })
    @Override
    Page<Product> findAll(Pageable pageable);
}
