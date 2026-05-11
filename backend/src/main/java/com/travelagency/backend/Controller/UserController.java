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
@CrossOrigin(origins={"http://localhost:5173", "http://localhost:8070","http://18.230.122.69:8070"})
public class UserController {

    private final UserService userService;

    @PutMapping("/update/{userId}")
    public ResponseEntity<String> updateUser(@RequestBody UserDTO userDTO, @PathVariable String userId){

        userService.updateUserDb(userId, userDTO);
        System.out.println("Update succesfully");
        return ResponseEntity.ok("User updated successfully");

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

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deactivateAccount(@PathVariable String userId){
        userService.deleteAccount(userId);
        return ResponseEntity.noContent().build();
    }
}
