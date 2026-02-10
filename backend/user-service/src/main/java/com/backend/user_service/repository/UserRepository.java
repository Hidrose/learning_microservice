package com.backend.user_service.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.backend.user_service.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
        Page<User> findByRole(String role, Pageable pageable);

        Page<User> findByEmailContainingIgnoreCaseAndRole(
                        String email, String role, Pageable pageable);

        Page<User> findByRoleAndStatus(
                        String role, Integer status, Pageable pageable);

        Page<User> findByEmailContainingIgnoreCaseAndRoleAndStatus(
                        String email, String role, Integer status, Pageable pageable);

        Page<User> findByRoleIn(List<String> roles, Pageable pageable);

        Page<User> findByEmailContainingIgnoreCaseAndRoleIn(
                        String email, List<String> roles, Pageable pageable);

        Page<User> findByRoleInAndStatus(
                        List<String> roles, Integer status, Pageable pageable);

        Page<User> findByEmailContainingIgnoreCaseAndRoleInAndStatus(
                        String email, List<String> roles, Integer status, Pageable pageable);

        Optional<User> findByEmail(String email);

        boolean existsByEmail(String email);

        boolean existsByPhone(String phone);

        Optional<User> findByPhone(String phone);
}
