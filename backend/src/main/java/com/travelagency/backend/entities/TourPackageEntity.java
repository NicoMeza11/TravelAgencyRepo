package com.travelagency.backend.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "TourPackages")
@Data
public class TourPackageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPackage;

    @Column(nullable = false, length = 50)
    private String packageName;

    @Column(nullable = false)
    private String destination;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private Date startDate;

    @Column(nullable = false)
    private Date finishDate;

    @Column(nullable = false)
    private double price;

    @Column
    private double packageDiscount;

    @Column
    private String urlImagen;

    @Column
    private String includedServices;

    @Column
    private String conditions;

    @Column
    private String restrictions;

    @Column(nullable = false)
    private int spotsAvailable;

    @Column
    private String travelType;

    @Column
    private String season;

    @Column(nullable = false)
    private String packageStatus;
}
