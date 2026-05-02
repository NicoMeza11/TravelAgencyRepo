package com.travelagency.backend.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Table(name = "payments")
@Data
public class PaymentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPayment;

    @Column(nullable = false)
    private double pricePayment;

    @Column(nullable = false)
    private Date paymentDate;

    @Column(nullable = false)
    private String paymentMethod;

    @OneToOne
    @JoinColumn(name = "id_reservation", nullable = false)
    private ReservationEntity reservation;
}
