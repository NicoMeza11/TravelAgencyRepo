package com.travelagency.backend.service;

import com.travelagency.backend.Controller.dto.UserDTO;
import org.keycloak.representations.idm.UserRepresentation;
import java.util.List;

public interface IKeycloakService {

    List<UserRepresentation> findAllUser();
    List<UserRepresentation> searchUserByUsername(String username);
    void deleteUser(String userId);
    void updateUser(String userId, UserDTO userDTO);
}
