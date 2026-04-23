    package com.travelagency.backend.Controller.dto;

    import lombok.Builder;
    import lombok.RequiredArgsConstructor;
    import lombok.Value;

    import java.util.Set;

    @Value
    @RequiredArgsConstructor
    @Builder
    public class UserDTO {

        private String id;
        private String email;
        private String firstName;
        private String lastName;
        private String password;
        private Set<String> roles;
        private String phoneNumber;
        private String documentId;
        private String nationality;
    }
