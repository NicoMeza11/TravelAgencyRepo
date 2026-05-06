package com.travelagency.backend.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.travelagency.backend.Controller.dto.UserDTO;
import com.travelagency.backend.entities.UserEntity;
import com.travelagency.backend.repository.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private IKeycloakService keycloakService;

    @InjectMocks
    private UserService userService;

    private UserEntity existingUser;
    private UserDTO userDTO;
    private final String USER_ID = "user-123";

    @BeforeEach
    void setUp() {
        // Base user entity setup
        existingUser = new UserEntity();
        existingUser.setId(USER_ID);
        existingUser.setFirstName("John");
        existingUser.setLastName("Doe");
        existingUser.setEmail("john.doe@example.com");
        existingUser.setUserStatus(true);

        // Base DTO setup
        userDTO = UserDTO.builder()
                .id(USER_ID)
                .firstName("Jane")
                .lastName("Smith")
                .email("jane.smith@example.com")
                .build();
    }

    // ==========================================
    // 1. TESTS FOR getUserById
    // ==========================================

    @Test
    void getUserById_UserExists_ReturnsUserEntity() {
        // Arrange
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(existingUser));

        // Act
        UserEntity result = userService.getUserById(USER_ID);

        // Assert
        assertNotNull(result);
        assertEquals(USER_ID, result.getId());
        assertEquals("John", result.getFirstName());
    }

    @Test
    void getUserById_UserDoesNotExist_ThrowsRuntimeException() {
        // Arrange
        when(userRepository.findById("invalid-id")).thenReturn(Optional.empty());

        // Act & Assert
        Exception exception = assertThrows(RuntimeException.class, () -> {
            userService.getUserById("invalid-id");
        });
        assertEquals("User can't be found on DB", exception.getMessage());
    }

    // ==========================================
    // 2. TESTS FOR updateUserDb (Includes cleanString logic)
    // ==========================================

    @Test
    void updateUserDb_UserExists_UpdatesUserAndCallsKeycloak() {
        // Arrange
        // We create a specific dirty DTO using Builder to test the private cleanString() method
        UserDTO dirtyDTO = UserDTO.builder()
                .id(USER_ID)
                .firstName("Jane")
                .lastName("Smith")
                .email("jane.smith@example.com")
                .phoneNumber("  +123456789  ") // Has leading/trailing spaces
                .documentId("   ")             // Is blank
                .nationality(null)             // Is null
                .build();

        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(existingUser));

        // Act
        userService.updateUserDb(USER_ID, dirtyDTO);

        // Assert
        // Verify database fields were updated and cleaned properly
        assertEquals("Jane", existingUser.getFirstName());
        assertEquals("+123456789", existingUser.getPhoneNumber()); // Should be trimmed
        assertNull(existingUser.getDocumentId());                  // Blank should become null
        assertNull(existingUser.getNationality());                 // Null should remain null
        assertTrue(existingUser.getUserStatus());

        // Verify repository save was called
        verify(userRepository, times(1)).save(existingUser);

        // Verify external keycloak service was called with the dirtyDTO
        verify(keycloakService, times(1)).updateUser(USER_ID, dirtyDTO);
    }

    @Test
    void updateUserDb_UserDoesNotExist_ThrowsRuntimeException() {
        // Arrange
        when(userRepository.findById(USER_ID)).thenReturn(Optional.empty());

        // Act & Assert
        Exception exception = assertThrows(RuntimeException.class, () -> {
            userService.updateUserDb(USER_ID, userDTO);
        });
        assertEquals("User can't be found on DB", exception.getMessage());

        // Verify save and keycloak updates were NEVER called
        verify(userRepository, never()).save(any());
        verify(keycloakService, never()).updateUser(anyString(), any());
    }

    // ==========================================
    // 3. TESTS FOR saveUserFromKeycloak
    // ==========================================

    @Test
    void saveUserFromKeycloak_UserAlreadyExists_SkipsSave() {
        // Arrange
        when(userRepository.existsById(USER_ID)).thenReturn(true);

        // Act
        userService.saveUserFromKeycloak(userDTO);

        // Assert
        // Verify it returns early and never saves anything
        verify(userRepository, never()).save(any(UserEntity.class));
    }

    @Test
    void saveUserFromKeycloak_UserDoesNotExist_SavesNewUser() {
        // Arrange
        when(userRepository.existsById(USER_ID)).thenReturn(false);

        // Act
        userService.saveUserFromKeycloak(userDTO);
        // Capture the saved entity to verify its fields
        verify(userRepository, times(1)).save(argThat(savedUser ->
                savedUser.getId().equals(USER_ID) &&
                        savedUser.getFirstName().equals("Jane") &&
                        savedUser.getLastName().equals("Smith") &&
                        savedUser.getEmail().equals("jane.smith@example.com") &&
                        savedUser.getPhoneNumber() == null &&
                        savedUser.getDocumentId() == null &&
                        savedUser.getNationality() == null &&
                        savedUser.getUserStatus() == true
        ));
    }

}
