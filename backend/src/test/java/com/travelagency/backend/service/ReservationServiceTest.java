package com.travelagency.backend.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.travelagency.backend.Controller.dto.ReservationRequestDTO;
import com.travelagency.backend.Controller.dto.ReservationResponseDTO;
import com.travelagency.backend.entities.PaymentEntity;
import com.travelagency.backend.entities.ReservationEntity;
import com.travelagency.backend.entities.TourPackageEntity;
import com.travelagency.backend.repository.PaymentRepository;
import com.travelagency.backend.repository.ReservationRepository;
import com.travelagency.backend.repository.TourPackageRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class ReservationServiceTest {

    // 1. We mock the 3 repositories the service actually uses
    @Mock
    private ReservationRepository reservationRepo;

    @Mock
    private TourPackageRepository tourPackageRepository;

    @Mock
    private PaymentRepository paymentRepository;

    // 2. We inject them into the REAL ReservationService
    @InjectMocks
    private ReservationService reservationService;

    private TourPackageEntity activePackage;
    private ReservationRequestDTO requestDTO;
    private ReservationEntity existingReservation;
    private final Long PACKAGE_ID = 10L;
    private final String CUSTOMER_ID = "user-123";
    private final Long RESERVATION_ID = 100L;

    @BeforeEach
    void setUp() {
        // Setup a valid active package
        activePackage = new TourPackageEntity();
        activePackage.setIdPackage(PACKAGE_ID);
        activePackage.setPackageStatus("ACTIVE");
        activePackage.setSpotsAvailable(10);
        activePackage.setPrice(1000.0);
        activePackage.setPackageDiscount(0.0); // No extra discount by default

        // Setup a mock DTO to avoid constructor issues
        requestDTO = mock(ReservationRequestDTO.class);
        lenient().when(requestDTO.getIdPackage()).thenReturn(PACKAGE_ID);
        lenient().when(requestDTO.getIdCustomer()).thenReturn(CUSTOMER_ID);
        lenient().when(requestDTO.getPassengerQuantity()).thenReturn(2); // Default to 2 passengers

        // Setup an existing reservation for cancellation tests
        existingReservation = new ReservationEntity();
        existingReservation.setIdReservation(RESERVATION_ID);
        existingReservation.setReservationStatus("CONFIRMED");
        existingReservation.setIdPackage(PACKAGE_ID);
        existingReservation.setPassengerQuantity(2);
    }

    // ==========================================
    // TESTS FOR createReservation
    // ==========================================

    @Test
    void createReservation_Success_NoDiscounts() {
        // Arrange
        when(tourPackageRepository.findById(PACKAGE_ID)).thenReturn(Optional.of(activePackage));
        when(reservationRepo.countByIdCustomerAndReservationStatus(CUSTOMER_ID, "CONFIRMED")).thenReturn(0L);

        when(reservationRepo.save(any(ReservationEntity.class))).thenAnswer(i -> {
            ReservationEntity res = i.getArgument(0);
            res.setIdReservation(RESERVATION_ID);
            return res;
        });

        // Act
        ReservationResponseDTO response = reservationService.createReservation(requestDTO);

        // Assert
        assertNotNull(response);
        assertEquals(RESERVATION_ID, response.getIdReservation()); // Agregamos "get"
        assertEquals(2000.0, response.getBasePrice()); // Agregamos "get"
        assertEquals(0.0, response.getDiscount()); // Agregamos "get"
        assertEquals(2000.0, response.getFinalAmount()); // Agregamos "get"
        assertEquals(8, activePackage.getSpotsAvailable());
        verify(tourPackageRepository, times(1)).save(activePackage);
    }

    @Test
    void createReservation_Success_MaxDiscountCapped() {
        // Arrange: Try to get more than 20% discount
        when(requestDTO.getPassengerQuantity()).thenReturn(5); // 10% group discount
        activePackage.setPackageDiscount(0.15); // 15% package discount
        when(tourPackageRepository.findById(PACKAGE_ID)).thenReturn(Optional.of(activePackage));

        // 5 confirmed reservations = 5% frequent client discount. Total = 30%
        when(reservationRepo.countByIdCustomerAndReservationStatus(CUSTOMER_ID, "CONFIRMED")).thenReturn(5L);

        when(reservationRepo.save(any(ReservationEntity.class))).thenAnswer(i -> i.getArgument(0));

        // Act
        ReservationResponseDTO response = reservationService.createReservation(requestDTO);

        // Assert
        assertEquals(5000.0, response.getBasePrice()); // Agregamos "get"
        assertEquals(0.20, response.getDiscount()); // Agregamos "get"
        assertEquals(4000.0, response.getFinalAmount()); // Agregamos "get"
    }

    @Test
    void createReservation_Success_PackageBecomesSoldOut() {
        // Arrange
        when(requestDTO.getPassengerQuantity()).thenReturn(10); // Buy all available spots
        when(tourPackageRepository.findById(PACKAGE_ID)).thenReturn(Optional.of(activePackage));
        when(reservationRepo.save(any(ReservationEntity.class))).thenAnswer(i -> i.getArgument(0));

        // Act
        reservationService.createReservation(requestDTO);

        // Assert
        assertEquals(0, activePackage.getSpotsAvailable());
        assertEquals("SOLD_OUT", activePackage.getPackageStatus());
    }

    @Test
    void createReservation_InvalidPassengerQuantity_ThrowsException() {
        when(requestDTO.getPassengerQuantity()).thenReturn(0);

        Exception exception = assertThrows(IllegalArgumentException.class, () ->
                reservationService.createReservation(requestDTO)
        );
        assertEquals("Passengers quantity must be higher than 0", exception.getMessage());
    }

    @Test
    void createReservation_PackageNotActive_ThrowsException() {
        activePackage.setPackageStatus("INACTIVE");
        when(tourPackageRepository.findById(PACKAGE_ID)).thenReturn(Optional.of(activePackage));

        Exception exception = assertThrows(RuntimeException.class, () ->
                reservationService.createReservation(requestDTO)
        );
        assertEquals("The package does not have ACTIVE status", exception.getMessage());
    }

    @Test
    void createReservation_NotEnoughSpots_ThrowsException() {
        when(requestDTO.getPassengerQuantity()).thenReturn(15); // Package only has 10
        when(tourPackageRepository.findById(PACKAGE_ID)).thenReturn(Optional.of(activePackage));

        Exception exception = assertThrows(RuntimeException.class, () ->
                reservationService.createReservation(requestDTO)
        );
        assertEquals("There are not enough places for this reservation", exception.getMessage());
    }

    // ==========================================
    // TESTS FOR getAllReservation / getAllReservationUser
    // ==========================================

    @Test
    void getAllReservation_ReturnsList() {
        when(reservationRepo.findAll()).thenReturn(Arrays.asList(existingReservation));
        List<ReservationEntity> result = reservationService.getAllReservation();
        assertEquals(1, result.size());
    }

    @Test
    void getAllReservationUser_ReturnsList() {
        when(reservationRepo.findByIdCustomer(CUSTOMER_ID)).thenReturn(Arrays.asList(existingReservation));
        List<ReservationEntity> result = reservationService.getAllReservationUser(CUSTOMER_ID);
        assertEquals(1, result.size());
    }

    // ==========================================
    // TESTS FOR cancelReservation
    // ==========================================

    @Test
    void cancelReservation_Success_WithPaymentAndRestoresSoldOutPackage() {
        // Arrange
        activePackage.setPackageStatus("SOLD_OUT");
        activePackage.setSpotsAvailable(0);

        when(reservationRepo.findById(RESERVATION_ID)).thenReturn(Optional.of(existingReservation));
        when(tourPackageRepository.findById(PACKAGE_ID)).thenReturn(Optional.of(activePackage));

        PaymentEntity mockPayment = new PaymentEntity();
        mockPayment.setPaymentStatus("APPROVED");
        when(paymentRepository.findPaymentEntityByReservation(existingReservation)).thenReturn(Optional.of(mockPayment));

        // Act
        reservationService.cancelReservation(RESERVATION_ID);

        // Assert
        assertEquals("CANCELLED", existingReservation.getReservationStatus());
        assertEquals(2, activePackage.getSpotsAvailable()); // Restored spots
        assertEquals("ACTIVE", activePackage.getPackageStatus()); // Changed from SOLD_OUT to ACTIVE
        assertEquals("REFUNDED", mockPayment.getPaymentStatus());

        verify(tourPackageRepository, times(1)).save(activePackage);
        verify(reservationRepo, times(1)).save(existingReservation);
        verify(paymentRepository, times(1)).save(mockPayment);
    }

    @Test
    void cancelReservation_AlreadyCancelled_ThrowsException() {
        // Arrange
        existingReservation.setReservationStatus("CANCELLED");
        when(reservationRepo.findById(RESERVATION_ID)).thenReturn(Optional.of(existingReservation));

        // Act & Assert
        Exception exception = assertThrows(RuntimeException.class, () ->
                reservationService.cancelReservation(RESERVATION_ID)
        );
        assertEquals("Reservation is already cancelled", exception.getMessage());
    }

}
