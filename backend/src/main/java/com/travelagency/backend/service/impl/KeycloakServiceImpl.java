package com.travelagency.backend.service.impl;

import com.travelagency.backend.Controller.dto.UserDTO;
import com.travelagency.backend.service.IKeycloakService;
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
     * Metodo para listar todos los usuarios de Keycloak
     * @return List<UserRepresentation>
     */
    @Override
    public List<UserRepresentation> findAllUser() {
        return keycloakProvider.getRealmResource()
                .users()
                .list();
    }

    /**
     * Metodo para buscar un usuario por su Username
     * @param username Nombre del usuario a buscar
     * @return List<UserRepresentation>
     */
    @Override
    public List<UserRepresentation> searchUserByUsername(String username) {
        return keycloakProvider.getRealmResource()
                .users()
                .searchByUsername(username, true);
    }

    /**
     * Metodo para crear un usuario nuevo en Keycloak
     * @param userDTO
     * @return String
     */
    @Override
    public String createUser(@NonNull UserDTO userDTO) {
        int status = 0;
        UsersResource userResource = keycloakProvider.getUserResource();

        UserRepresentation userRepresentation = new UserRepresentation();
        userRepresentation.setFirstName(userDTO.getFirstName());
        userRepresentation.setLastName(userDTO.getLastName());
        userRepresentation.setEmail(userDTO.getEmail());
        userRepresentation.setUsername(userDTO.getUsername());
        userRepresentation.setEmailVerified(true);
        userRepresentation.setEnabled(true);

        Response response = userResource.create(userRepresentation);
        status = response.getStatus();

        if(status == 201){
            String path = response.getLocation().getPath();
            String userId = path.substring(path.lastIndexOf("/") + 1);

            CredentialRepresentation credentialRepresentation = new CredentialRepresentation();
            credentialRepresentation.setTemporary(false);
            credentialRepresentation.setType(OAuth2Constants.PASSWORD);
            credentialRepresentation.setValue(userDTO.getPassword());

            userResource.get(userId).resetPassword(credentialRepresentation);

            RealmResource realmResource = keycloakProvider.getRealmResource();

            List<RoleRepresentation> roleRepresentations = null;

            if(userDTO.getRoles() == null || userDTO.getRoles().isEmpty()){
                roleRepresentations = List.of(realmResource.roles().get("user").toRepresentation());
            } else{
                roleRepresentations = realmResource.roles()
                        .list()
                        .stream()
                        .filter(role -> userDTO.getRoles()
                                .stream()
                                .anyMatch(roleName -> roleName.equalsIgnoreCase(role.getName())))
                        .toList();
            }

            realmResource.users()
                    .get(userId)
                    .roles()
                    .realmLevel()
                    .add(roleRepresentations);

            return "User created successfully";
        } else if(status == 409){
            log.error("User exist already");
            return "User exist already";
        } else{
            log.error("Error creating user");
            return "Error creating user";
        }
    }

    /**
     * Metodo para borrar un usuario en Keycloak
     * @param userId Id del usuario
     */
    @Override
    public void deleteUser(String userId) {
        keycloakProvider.getUserResource()
                .get(userId)
                .remove();
    }

    /**
     * Metodo para actualizar un usuario
     * @param userId Id del usuario
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
        userRepresentation.setUsername(userDTO.getUsername());
        userRepresentation.setEmailVerified(true);
        userRepresentation.setEnabled(true);
        userRepresentation.setCredentials(Collections.singletonList(credentialRepresentation));

        UserResource userResource = keycloakProvider.getUserResource().get(userId);
        userResource.update(userRepresentation);
    }
}
