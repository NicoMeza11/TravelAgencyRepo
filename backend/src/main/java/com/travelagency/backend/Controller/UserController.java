package com.travelagency.backend.Controller;

import com.travelagency.backend.Controller.dto.UserDTO;
import com.travelagency.backend.service.UserService;
import lombok.RequiredArgsConstructor;
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

    @PostMapping("/create")
    public ResponseEntity<String> createUser(@RequestBody UserDTO userDTO) throws URISyntaxException{

        String responseMessage = userService.registerNewUser(userDTO);

        return ResponseEntity.created(new URI("/user/create")).body(responseMessage);
    }

    @PutMapping("/update/{userId}")
    public ResponseEntity<String> updateUser(@RequestBody UserDTO userDTO, @PathVariable String userId){
        userService.updateUserDb(userId,userDTO);

        return ResponseEntity.ok("User updated successfully");
    }

    @PostMapping("/sync")
    public ResponseEntity<?> saveUserDatabase(@RequestBody UserDTO userDTO){
        userService.saveUserFromKeycloak(userDTO);
        return ResponseEntity.ok().body("User saved in database successfully");
    }

}
