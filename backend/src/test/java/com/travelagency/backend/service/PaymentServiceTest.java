package com.travelagency.backend.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.travelagency.backend.Controller.dto.PaymentRequestDTO;
import com.travelagency.backend.entities.PaymentEntity;
import com.travelagency.backend.entities.ReservationEntity;
import com.travelagency.backend.repository.PaymentRepository;
import com.travelagency.backend.repository.ReservationRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepo;

    @Mock
    private ReservationRepository reservationRepo;

    @InjectMocks
    private PaymentService paymentService;

    private ReservationEntity pendingReservation;
    private PaymentRequestDTO requestDTO;
    private final Long RESERVATION_ID = 100L;

    @BeforeEach
    void setUp() {
        // Setup a valid reservation ready to be paid
        pendingReservation = new ReservationEntity();
        pendingReservation.setIdReservation(RESERVATION_ID);
        pendingReservation.setReservationStatus("PENDING_PAYMENT");
        pendingReservation.setFinalAmount(1500.0);

        // We mock the DTO to avoid any issues with @Value, @Builder or Missing Constructors
        requestDTO = mock(PaymentRequestDTO.class);

        // Define the behavior of our mocked DTO
        lenient().when(requestDTO.getIdReservation()).thenReturn(RESERVATION_ID);
        lenient().when(requestDTO.getPaymentMethod()).thenReturn("CREDIT_CARD");
    }

    // ==========================================
    // TESTS FOR processPayment
    // ==========================================

    @Test
    void processPayment_Success_CreatesPaymentAndConfirmsReservation() {
        // Arrange
        when(reservationRepo.findById(RESERVATION_ID)).thenReturn(Optional.of(pendingReservation));

        // Simulate saving the payment and assigning it an ID
        when(paymentRepo.save(any(PaymentEntity.class))).thenAnswer(invocation -> {
            PaymentEntity savedPayment = invocation.getArgument(0);
            savedPayment.setIdPayment(1L);
            return savedPayment;
        });

        // Act
        PaymentEntity result = paymentService.processPayment(requestDTO);

        // Assert
        // 1. Verify the returned payment has correct values
        assertNotNull(result);
        assertEquals(1L, result.getIdPayment());
        assertEquals(1500.0, result.getPricePayment());
        assertEquals("CREDIT_CARD", result.getPaymentMethod());
        assertEquals("APPROVED", result.getPaymentStatus());
        assertNotNull(result.getPaymentDate());
        assertEquals(pendingReservation, result.getReservation());

        // 2. Verify the reservation status was updated
        assertEquals("CONFIRMED", pendingReservation.getReservationStatus());

        // 3. Verify both repositories executed the save operation exactly once
        verify(paymentRepo, times(1)).save(any(PaymentEntity.class));
        verify(reservationRepo, times(1)).save(pendingReservation);
    }

    @Test
    void processPayment_ReservationNotFound_ThrowsRuntimeException() {
        // Arrange
        when(reservationRepo.findById(RESERVATION_ID)).thenReturn(Optional.empty());

        // Act & Assert
        Exception exception = assertThrows(RuntimeException.class, () -> {
            paymentService.processPayment(requestDTO);
        });

        assertEquals("Reservation not found", exception.getMessage());

        // Verify we never attempted to save a payment or update a reservation
        verify(paymentRepo, never()).save(any());
        verify(reservationRepo, never()).save(any());
    }

    @Test
    void processPayment_ReservationNotPending_ThrowsRuntimeException() {
        // Arrange
        // Change the status to something other than PENDING_PAYMENT
        pendingReservation.setReservationStatus("CANCELLED");
        when(reservationRepo.findById(RESERVATION_ID)).thenReturn(Optional.of(pendingReservation));

        // Act & Assert
        Exception exception = assertThrows(RuntimeException.class, () -> {
            paymentService.processPayment(requestDTO);
        });

        assertEquals("This reservation does not have PENDING_PAYMENT status", exception.getMessage());

        // Verify we never attempted to save a payment or update a reservation
        verify(paymentRepo, never()).save(any());
        verify(reservationRepo, never()).save(any());
    }

}
