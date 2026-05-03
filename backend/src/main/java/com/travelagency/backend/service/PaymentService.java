package com.travelagency.backend.service;

import com.travelagency.backend.Controller.dto.PaymentRequestDTO;
import com.travelagency.backend.entities.PaymentEntity;
import com.travelagency.backend.entities.ReservationEntity;
import com.travelagency.backend.repository.PaymentRepository;
import com.travelagency.backend.repository.ReservationRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@Slf4j
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepo;
    private final ReservationRepository reservationRepo;

    @Transactional
    public PaymentEntity processPayment(PaymentRequestDTO requestDTO){

        ReservationEntity reservation = reservationRepo.findById(requestDTO.getIdReservation())
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        //Validate the status
        if(!reservation.getReservationStatus().equals("PENDING_PAYMENT")){
            throw new RuntimeException("This reservation does not have PENDING_PAYMENT status");
        }

        //Build and save the payment
        PaymentEntity payment = new PaymentEntity();

        payment.setPricePayment(reservation.getFinalAmount());
        payment.setPaymentDate(new Date());
        payment.setPaymentMethod(requestDTO.getPaymentMethod());
        payment.setReservation(reservation);

        PaymentEntity savedPayment = paymentRepo.save(payment);

        reservation.setReservationStatus("CONFIRMED");
        reservationRepo.save(reservation);

        return savedPayment;
    }

}
