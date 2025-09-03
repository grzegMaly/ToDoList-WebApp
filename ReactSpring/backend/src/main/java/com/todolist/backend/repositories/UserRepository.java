package com.todolist.backend.repositories;

import com.todolist.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findUserByEmail(String email);
    boolean existsUserByEmail(String email);
    Optional<User> findUserByUserId(UUID userId);

    boolean existsByUsername(String username);
}
