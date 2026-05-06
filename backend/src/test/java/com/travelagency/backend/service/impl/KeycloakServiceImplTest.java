package com.travelagency.backend.service.impl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.travelagency.backend.Controller.dto.UserDTO;
import com.travelagency.backend.util.KeycloakProvider;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class KeycloakServiceImplTest {
    @Mock
    private KeycloakProvider keycloakProvider;

    // We need to mock the Keycloak API classes that are returned in the chain
    @Mock
    private UsersResource usersResource;

    @Mock
    private UserResource userResource;

    @InjectMocks
    private KeycloakServiceImpl keycloakService;

    private final String USER_ID = "kc-user-123";
    private UserRepresentation userRepresentation;

    @BeforeEach
    void setUp() {
        // Setup the representation POJO that Keycloak will return
        userRepresentation = new UserRepresentation();
        userRepresentation.setId(USER_ID);
        userRepresentation.setFirstName("OldName");
        userRepresentation.setLastName("OldLastName");

        // Mock the Keycloak provider chain: provider -> usersResource -> userResource
        when(keycloakProvider.getUserResource()).thenReturn(usersResource);
        when(usersResource.get(USER_ID)).thenReturn(userResource);

        // Mock the object conversion
        when(userResource.toRepresentation()).thenReturn(userRepresentation);
    }

    // ==========================================
    // TESTS FOR updateUser
    // ==========================================

    @Test
    void updateUser_WithoutPassword_UpdatesNamesOnly() {
        // Arrange
        UserDTO userDTO = UserDTO.builder()
                .firstName("NewName")
                .lastName("NewLastName")
                .password(null) // No password provided
                .build();

        // Act
        keycloakService.updateUser(USER_ID, userDTO);

        // Assert
        // 1. Verify the UserRepresentation was modified in memory
        assertEquals("NewName", userRepresentation.getFirstName());
        assertEquals("NewLastName", userRepresentation.getLastName());

        // 2. Verify the update method was called on Keycloak exactly once
        verify(userResource, times(1)).update(userRepresentation);

        // 3. Verify resetPassword was NEVER called since password was null
        verify(userResource, never()).resetPassword(any());
    }

    @Test
    void updateUser_WithEmptyPassword_UpdatesNamesOnly() {
        // Arrange
        UserDTO userDTO = UserDTO.builder()
                .firstName("NewName")
                .lastName("NewLastName")
                .password("") // Empty password provided
                .build();

        // Act
        keycloakService.updateUser(USER_ID, userDTO);

        // Assert
        // Verify update was called but password reset was skipped
        verify(userResource, times(1)).update(userRepresentation);
        verify(userResource, never()).resetPassword(any());
    }

    @Test
    void updateUser_WithPassword_UpdatesNamesAndPassword() {
        // Arrange
        String newPassword = "SecurePassword123!";
        UserDTO userDTO = UserDTO.builder()
                .firstName("NewName")
                .lastName("NewLastName")
                .password(newPassword)
                .build();

        // Act
        keycloakService.updateUser(USER_ID, userDTO);

        // Assert
        // 1. Verify names were updated
        verify(userResource, times(1)).update(userRepresentation);

        // 2. Use ArgumentCaptor to catch the CredentialRepresentation before it goes to Keycloak
        ArgumentCaptor<CredentialRepresentation> credentialCaptor = ArgumentCaptor.forClass(CredentialRepresentation.class);
        verify(userResource, times(1)).resetPassword(credentialCaptor.capture());

        // 3. Inspect the captured credential to ensure it was built correctly
        CredentialRepresentation capturedCredential = credentialCaptor.getValue();
        assertFalse(capturedCredential.isTemporary());
        assertEquals(OAuth2Constants.PASSWORD, capturedCredential.getType());
        assertEquals(newPassword, capturedCredential.getValue());
    }
}
