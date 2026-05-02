package com.travelagency.backend.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Table(name = "reservation")
@Data
public class ReservationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idReservation;

    @Column(nullable = false)
    private String idCustomer;

    @Column(nullable = false)
    private Long idPackage;

    @Column(nullable = false)
    private Date date;

    @Column(nullable = false)
    private double price;

}
