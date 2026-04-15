package com.travelagency.backend.repository;

import com.travelagency.backend.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, String> {

    Optional<UserEntity> findByIdUser(String id);
    boolean existsByEmail(String email);
}
