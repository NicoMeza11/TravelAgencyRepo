package com.travelagency.backend.entities;

import jakarta.persistence.*;
import lombok.Data;
import org.jboss.resteasy.spi.touri.MappedBy;

import java.util.List;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @Column(length = 40)
    private String id;

    @Column(nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 20)
    private String phoneNumber;

    @Column(nullable = false, length = 10)
    private String role;

    @Column(nullable = false)
    private Boolean status;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL)
    private List<TourismPackage> packageHistory;

}
