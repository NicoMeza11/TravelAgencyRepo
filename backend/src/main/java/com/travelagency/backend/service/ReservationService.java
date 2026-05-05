package com.travelagency.backend.service;

import com.travelagency.backend.Controller.dto.ReservationRequestDTO;
import com.travelagency.backend.Controller.dto.ReservationResponseDTO;
import com.travelagency.backend.entities.PaymentEntity;
import com.travelagency.backend.entities.ReservationEntity;
import com.travelagency.backend.entities.TourPackageEntity;
import com.travelagency.backend.repository.PaymentRepository;
import com.travelagency.backend.repository.ReservationRepository;
import com.travelagency.backend.repository.TourPackageRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReservationService {

    private final ReservationRepository reservationRepo;
    private final TourPackageRepository tourPackageRepository;
    private final PaymentRepository paymentRepository;

    private static final double  GROUP_DISCOUNT_PERCENTAGE = 0.1; //10% discount for 4+ passengers
    private static final double FREQUENT_CLIENT_DISCOUNT_PERCENTAGE = 0.05; //5% discount for frequent client
    private static final double MAX_DISCOUNT_ALLOWED = 0.20; // 20% = mas discount allowed

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
        if(tourPackage.getSpotsAvailable() == 0){
            tourPackage.setPackageStatus("SOLD_OUT");
        }
        tourPackageRepository.save(tourPackage);

        double packagePrice = tourPackage.getPrice();
        double basePrice = packagePrice * requestDTO.getPassengerQuantity();
        double totalDiscount = 0.0;

        if(requestDTO.getPassengerQuantity() >= 4){
            totalDiscount += GROUP_DISCOUNT_PERCENTAGE;
            System.out.println("Group discount activated");
        }

        if(tourPackage.getPackageDiscount() > 0){
            totalDiscount += tourPackage.getPackageDiscount();
        }

        long paidReservationsCount = reservationRepo.countByIdCustomerAndReservationStatus(
                requestDTO.getIdCustomer(), "CONFIRMED"
        );

        if(paidReservationsCount >= 3){
            totalDiscount += FREQUENT_CLIENT_DISCOUNT_PERCENTAGE;
            System.out.println("Frequent client discount activated");
        }

        if(totalDiscount > MAX_DISCOUNT_ALLOWED){
            totalDiscount = MAX_DISCOUNT_ALLOWED;
            log.info("Total discount: {} exceeds max, setting discount to 20%", totalDiscount);
        }

        double moneyDiscounted = (basePrice*totalDiscount);
        double finalAmount = Math.round((basePrice - moneyDiscounted) * 100.0)/100.0;

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

    public List<ReservationEntity> getAllReservation(){
        return reservationRepo.findAll();
    }

    public List<ReservationEntity> getAllReservationUser(String userId){
        return reservationRepo.findByIdCustomer(userId);
    }

    @Transactional
    public void cancelReservation(Long reservationId){

        ReservationEntity reservation = reservationRepo.findById(reservationId)
                        .orElseThrow(() -> new RuntimeException("Cannot found reservation with id: "+ reservationId));

        if("CANCELLED".equals(reservation.getReservationStatus())){
            throw new RuntimeException("Reservation is already cancelled");
        }

        TourPackageEntity tourPackage = tourPackageRepository.findById(reservation.getIdPackage())
                        .orElseThrow(() -> new RuntimeException("Cannot found package with id: "+ reservation.getIdPackage()));

        int newSpots = reservation.getPassengerQuantity() + tourPackage.getSpotsAvailable();
        tourPackage.setSpotsAvailable(newSpots); //we replace the spots available


        if("SOLD_OUT".equals(tourPackage.getPackageStatus()) && newSpots > 0){
            tourPackage.setPackageStatus("ACTIVE");
        }
        tourPackageRepository.save(tourPackage);

        reservation.setReservationStatus("CANCELLED");
        reservationRepo.save(reservation);

        Optional<PaymentEntity> paymentOpt = paymentRepository.findPaymentEntityByReservation(reservation);
        if(paymentOpt.isPresent()){
            PaymentEntity payment = paymentOpt.get();
            payment.setPaymentStatus("REFUNDED");
            paymentRepository.save(payment);
            System.out.println("Payment refunded");
        }else{
            log.info("The reservation did not has a payment associated");
        }

        log.info("Reservation with id {} cancelled successfully", reservationId);
    }

}
