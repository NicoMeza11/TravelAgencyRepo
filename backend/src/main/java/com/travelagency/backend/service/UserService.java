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

    public UserEntity getUserById(String userId){
        return userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User can't be found on DB"));
    }

    private String cleanString(String input){
        if(input == null || input.isBlank()){
            return null;
        }else{
            return input.trim();
        }
    }

    @Transactional
    public void updateUserDb(String kcUserId, UserDTO userDTO){

        UserEntity userEntity = userRepository.findById(kcUserId).orElseThrow(() -> new RuntimeException("User can't be found on DB"));
        userEntity.setFirstName(userDTO.getFirstName());
        userEntity.setLastName(userDTO.getLastName());
        userEntity.setEmail(userDTO.getEmail());
        userEntity.setPhoneNumber(cleanString(userDTO.getPhoneNumber()));
        userEntity.setDocumentId(cleanString(userDTO.getDocumentId()));
        userEntity.setNationality(cleanString(userDTO.getNationality()));
        userEntity.setUserStatus(true);

        userRepository.save(userEntity);

        keycloakService.updateUser(kcUserId,userDTO);
    }

    public void saveUserFromKeycloak(UserDTO userDTO){
        if(userRepository.existsById(userDTO.getId())){
            log.info("User {} already exists in database, skipping save", userDTO.getId());
            return;
        }

        UserEntity userEntity = new UserEntity();

        userEntity.setId(userDTO.getId());
        userEntity.setFirstName(userDTO.getFirstName());
        userEntity.setLastName(userDTO.getLastName());
        userEntity.setEmail(userDTO.getEmail());

        userEntity.setPhoneNumber(null);
        userEntity.setDocumentId(null);
        userEntity.setNationality(null);
        userEntity.setUserStatus(true);

        userRepository.save(userEntity);
        log.info("User {} synced from Keycloak to database", userDTO.getId());
    }
}
