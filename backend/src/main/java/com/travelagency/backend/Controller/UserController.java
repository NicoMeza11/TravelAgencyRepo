package com.travelagency.backend.Controller;

import com.travelagency.backend.Controller.dto.UserDTO;
import com.travelagency.backend.entities.UserEntity;
import com.travelagency.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin(origins="http://localhost:5173")
public class UserController {

    private final UserService userService;

    @PutMapping("/update/{userId}")
    public ResponseEntity<String> updateUser(@RequestBody UserDTO userDTO, @PathVariable String userId){

        System.out.println("Peticion recibida");
        try {
            userService.updateUserDb(userId, userDTO);
            System.out.println("----> Actualización exitosa");
            return ResponseEntity.ok("User updated successfully");

        } catch (Exception e) {
            System.err.println("----> ERROR EN BACKEND AL ACTUALIZAR: " + e.getMessage());
            e.printStackTrace(); // Esto imprimirá el error real en tu consola de Java
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno: " + e.getMessage());
        }
    }

    @PostMapping("/sync")
    public ResponseEntity<?> saveUserDatabase(@RequestBody UserDTO userDTO){
        userService.saveUserFromKeycloak(userDTO);
        return ResponseEntity.ok().body("User saved in database successfully");
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserEntity> getUserById(@PathVariable String userId){
        return ResponseEntity.ok(userService.getUserById(userId));
    }
}
