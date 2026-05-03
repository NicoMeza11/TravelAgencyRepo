package com.travelagency.backend.Controller.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReservationRequestDTO {

    private String idCustomer;
    private Long idPackage;
    private int passengerQuantity;
}
