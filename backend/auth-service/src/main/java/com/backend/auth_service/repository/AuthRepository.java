package com.backend.auth_service.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.backend.auth_service.entity.Otp;

@Repository
public interface AuthRepository extends JpaRepository<Otp, String> {
    Optional<Otp> findByEmail(String email);

    void deleteByEmail(String email);

    @Modifying
    @Query("DELETE FROM Otp o WHERE o.expiredAt < :now")
    void deleteExpiredOtp(LocalDateTime now);
}
