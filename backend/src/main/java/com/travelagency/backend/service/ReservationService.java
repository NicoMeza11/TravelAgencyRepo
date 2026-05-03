package com.travelagency.backend.service;

import com.travelagency.backend.Controller.dto.ReservationRequestDTO;
import com.travelagency.backend.Controller.dto.ReservationResponseDTO;
import com.travelagency.backend.entities.ReservationEntity;
import com.travelagency.backend.entities.TourPackageEntity;
import com.travelagency.backend.repository.ReservationRepository;
import com.travelagency.backend.repository.TourPackageRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Date;

import static java.lang.Math.round;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReservationService {

    private final ReservationRepository reservationRepo;

    private static final double  GROUP_DISCOUNT_PERCENTAGE = 0.1; //10% discount for 4+ passengers
    private static final double FREQUENT_CLIENT_DISCOUNT_PERCENTAGE = 0.05; //5% discount for frequent client
    private static final double MAX_DISCOUNT_ALLOWED = 0.20; // 20% = mas discount allowed
    private final TourPackageRepository tourPackageRepository;

    @Transactional
    public ReservationResponseDTO createReservation(ReservationRequestDTO requestDTO){

        //Validate the passengers quantity
        if(requestDTO.getPassengerQuantity() <= 0){
            throw new IllegalArgumentException("Passengers quantity must be higher than 0");
        }

        //Validate the id
        TourPackageEntity tourPackage = tourPackageRepository.findById(requestDTO.getIdPackage())
                .orElseThrow(() -> new RuntimeException("Cannot find package"));

        //Validate the status of the package
        if(!tourPackage.getPackageStatus().equals("ACTIVE")){
            throw new RuntimeException("The package does not have ACTIVE status");
        }

        //Validate the spots available
        if(requestDTO.getPassengerQuantity() > tourPackage.getSpotsAvailable()){
            throw new RuntimeException("There are not enough places for this reservation");
        }

        //We substract availables spots to the package
        tourPackage.setSpotsAvailable(tourPackage.getSpotsAvailable() - requestDTO.getPassengerQuantity());
        tourPackageRepository.save(tourPackage);

        double packagePrice = tourPackage.getPrice();
        double basePrice = packagePrice * requestDTO.getPassengerQuantity();
        double totalDiscount = 0.0;

        if(requestDTO.getPassengerQuantity() >= 4){
            totalDiscount += GROUP_DISCOUNT_PERCENTAGE;
        }

        if(tourPackage.getPackageDiscount() > 0){
            totalDiscount += tourPackage.getPackageDiscount();
        }

        long paidReservationsCount = reservationRepo.countByIdCustomerAndReservationStatus(
                requestDTO.getIdCustomer(), "CONFIRMED"
        );

        if(paidReservationsCount >= 3){
            totalDiscount += FREQUENT_CLIENT_DISCOUNT_PERCENTAGE;
        }

        if(totalDiscount > MAX_DISCOUNT_ALLOWED){
            totalDiscount = MAX_DISCOUNT_ALLOWED;
        }

        basePrice = basePrice - (basePrice*totalDiscount);
        double finalAmount = Math.round(basePrice * 100.0)/100.0;

        //Build and save the reservation
        ReservationEntity reservation = new ReservationEntity();
        reservation.setIdCustomer(requestDTO.getIdCustomer());
        reservation.setIdPackage(requestDTO.getIdPackage());
        reservation.setPassengerQuantity(requestDTO.getPassengerQuantity());
        reservation.setDate(new Date());
        reservation.setBasePrice(basePrice);
        reservation.setDiscount(totalDiscount);
        reservation.setFinalAmount(finalAmount);
        reservation.setReservationStatus("PENDING_PAYMENT");

        ReservationEntity savedReservation = reservationRepo.save(reservation);

        //Return the response DTO
        return new ReservationResponseDTO(
                savedReservation.getIdReservation(),
                savedReservation.getIdPackage(),
                savedReservation.getPassengerQuantity(),
                savedReservation.getDate(),
                savedReservation.getBasePrice(),
                savedReservation.getDiscount(),
                savedReservation.getFinalAmount(),
                savedReservation.getReservationStatus()
        );
    }

}
