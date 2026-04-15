package com.travelagency.backend.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class UserEntity {

    @Id
    @Column(length = 40)
    private String id;

    @Column(nullable = false, length = 30)
    private String firstName;

    @Column(nullable = false, length = 30)
    private String lastName;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(nullable = false, length = 20)
    private String phoneNumber;

    @Column(length = 20)
    private String documentId;

    @Column(length = 30)
    private String nationality;

    @Column(nullable = false)
    private Boolean userStatus; //true = active, false = inactive


}
