package com.travelagency.backend.Controller.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReservationResponseDTO {

    private Long idReservation;
    private Long idPackage;
    private int passengerQuantity;
    private Date reservationDate;
    private double basePrice;
    private double discount;
    private double finalAmount;
    private String reservationStatus;
}
