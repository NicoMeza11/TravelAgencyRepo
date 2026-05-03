package com.travelagency.backend.Controller.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentRequestDTO {

    private Long idReservation;
    private String cardNumber;
    private String expirationDate;
    private String cvv;
    private String paymentMethod;

}
