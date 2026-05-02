package com.travelagency.backend.service.impl;

import com.travelagency.backend.Controller.dto.UserDTO;
import com.travelagency.backend.entities.UserEntity;
import com.travelagency.backend.repository.UserRepository;
import com.travelagency.backend.service.IKeycloakService;
import com.travelagency.backend.service.UserService;
import com.travelagency.backend.util.KeycloakProvider;
import jakarta.ws.rs.core.Response;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class KeycloakServiceImpl implements IKeycloakService {

    private final KeycloakProvider keycloakProvider;

    /**
     * Method to list all users
     * @return List<UserRepresentation>
     */
    @Override
    public List<UserRepresentation> findAllUser() {
        return keycloakProvider.getRealmResource()
                .users()
                .list();
    }

    /**
     * Method to search a user by his username
     * @param username Username of the user
     * @return List<UserRepresentation>
     */
    @Override
    public List<UserRepresentation> searchUserByUsername(String username) {
        return keycloakProvider.getRealmResource()
                .users()
                .searchByUsername(username, true);
    }

    /**
     * Method to delete a user in keycloak
     * @param userId Id del usuario
     */
    @Override
    public void deleteUser(String userId) {
        keycloakProvider.getUserResource()
                .get(userId)
                .remove();
    }

    /**
     * Method to update a user
     * @param userId id of the user
     * @param userDTO
     */
    @Override
    public void updateUser(String userId, @NonNull UserDTO userDTO) {

        CredentialRepresentation credentialRepresentation = new CredentialRepresentation();
        credentialRepresentation.setTemporary(false);
        credentialRepresentation.setType(OAuth2Constants.PASSWORD);
        credentialRepresentation.setValue(userDTO.getPassword());

        UserRepresentation userRepresentation = new UserRepresentation();
        userRepresentation.setFirstName(userDTO.getFirstName());
        userRepresentation.setLastName(userDTO.getLastName());
        userRepresentation.setEmail(userDTO.getEmail());
        userRepresentation.setId(userDTO.getId());
        userRepresentation.setEmailVerified(true);
        userRepresentation.setEnabled(true);
        userRepresentation.setCredentials(Collections.singletonList(credentialRepresentation));

        UserResource userResource = keycloakProvider.getUserResource().get(userId);
        userResource.update(userRepresentation);
    }
}
