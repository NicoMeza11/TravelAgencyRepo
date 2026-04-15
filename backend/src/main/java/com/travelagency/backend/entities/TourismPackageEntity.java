package com.travelagency.backend.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "TourismPackages")
@Data
public class TourismPackageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String packageName;

    @Column(nullable = false, length = 20)
    private String destination;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String startDate;

    @Column(nullable = false)
    private String finishDate;

    @Column(nullable = false)
    private int price;

    @Column(nullable = false)
    private int spotsAvailable;

    @Column(nullable = false)
    private String packageStatus;
}
