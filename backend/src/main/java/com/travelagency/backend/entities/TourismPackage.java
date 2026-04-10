package com.travelagency.backend.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "TourismPackages")
@Data
public class TourismPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
}
