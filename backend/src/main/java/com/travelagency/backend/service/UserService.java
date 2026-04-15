package com.travelagency.backend.service;

import com.travelagency.backend.Controller.dto.UserDTO;
import com.travelagency.backend.entities.UserEntity;
import com.travelagency.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final IKeycloakService keycloakService;

    @Transactional
    public String registerNewUser(UserDTO userDTO){

        String keycloakUserId = keycloakService.createUser(userDTO);

        if(keycloakUserId.contains("Error") || keycloakUserId.contains("exist")){

            throw new RuntimeException("Error creating user in keycloak: " + keycloakUserId);
        }

        try{
            UserEntity userEntity = new UserEntity();
            userEntity.setId(keycloakUserId);
            userEntity.setFirstName(userDTO.getFirstName());
            userEntity.setLastName(userDTO.getLastName());
            userEntity.setEmail(userDTO.getEmail());
            userEntity.setPhoneNumber(userDTO.getPhoneNumber());
            userEntity.setDocumentId(userDTO.getDocumentId());
            userEntity.setNationality(userDTO.getNationality());
            userEntity.setUserStatus(true);

            userRepository.save(userEntity);
            return "User registered in both systems successfully";
        } catch (Exception e){
            keycloakService.deleteUser(keycloakUserId);
            log.error("Error saving user in database, rolling back Keycloak user {}", keycloakUserId);
            throw new RuntimeException("Error saving user in database: " + e.getMessage());
        }
    }

    public User
}
