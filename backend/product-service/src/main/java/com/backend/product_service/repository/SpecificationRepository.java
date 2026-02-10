package com.backend.product_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.product_service.entity.Specification;

@Repository
public interface SpecificationRepository extends JpaRepository<Specification, String> {

}
