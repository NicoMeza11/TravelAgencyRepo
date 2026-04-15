package com.travelagency.backend.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.util.Date;

@Entity
@Table(name = "reservation")
@Data
public class ReservationEntity {

    @Id
    @Column(nullable = false)
    private String idReservation;

    @Column(nullable = false)
    private String idCustomer;

    @Column(nullable = false)
    private String idPackage;

    @Column(nullable = false)
    private Date date;

    @Column(nullable = false)
    private int price;




}
