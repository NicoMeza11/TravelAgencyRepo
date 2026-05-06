package com.travelagency.backend.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.travelagency.backend.entities.TourPackageEntity;
import com.travelagency.backend.repository.ReservationRepository;
import com.travelagency.backend.repository.TourPackageRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class TourPackageServiceTest {

    @Mock
    private TourPackageRepository packageRepository;

    @Mock
    private ReservationRepository reservationRepository;

    @InjectMocks
    private TourPackageService tourPackageService;

    private TourPackageEntity validPackage;
    private Date tomorrow;
    private Date nextWeek;

    @BeforeEach
    void setUp() {
        long now = System.currentTimeMillis();
        tomorrow = new Date(now + 86400000L); // +1 day
        nextWeek = new Date(now + 7 * 86400000L); // +7 days

        // We create a valid base package before each test
        validPackage = new TourPackageEntity();
        validPackage.setIdPackage(1L);
        validPackage.setPackageName("Cancun Spring Break");
        validPackage.setDestination("Cancun, Mexico");
        validPackage.setDescription("A wonderful trip to the beach.");
        validPackage.setStartDate(tomorrow);
        validPackage.setFinishDate(nextWeek);
        validPackage.setPrice(1500.0);
        validPackage.setSpotsAvailable(10);
        validPackage.setPackageStatus("ACTIVE");
    }

    // ==========================================
    // 1. TESTS of validateBusinessRules and savePackage
    // ==========================================

    @Test
    void savePackage_ValidPackage_ReturnsSavedPackage() {
        when(packageRepository.save(any(TourPackageEntity.class))).thenReturn(validPackage);

        TourPackageEntity savedPackage = tourPackageService.savePackage(validPackage);

        assertNotNull(savedPackage);
        assertEquals("Cancun Spring Break", savedPackage.getPackageName());
        verify(packageRepository, times(1)).save(validPackage);
    }

    @Test
    void savePackage_NullName_ThrowsIllegalArgumentException() {
        validPackage.setPackageName(null);

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            tourPackageService.savePackage(validPackage);
        });
        assertEquals("Name, destination, description, dates are mandatory fields", exception.getMessage());
        verify(packageRepository, never()).save(any());
    }

    @Test
    void savePackage_ZeroPrice_ThrowsIllegalArgumentException() {
        validPackage.setPrice(0.0);

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            tourPackageService.savePackage(validPackage);
        });
        assertEquals("The price must be greater than zero", exception.getMessage());
    }

    @Test
    void savePackage_NegativeSpots_ThrowsIllegalArgumentException() {
        validPackage.setSpotsAvailable(-5);

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            tourPackageService.savePackage(validPackage);
        });
        assertEquals("Total spots cannot be negative", exception.getMessage());
    }

    @Test
    void savePackage_InvalidDates_ThrowsIllegalArgumentException() {
        validPackage.setStartDate(nextWeek);
        validPackage.setFinishDate(tomorrow); // Finish is before Start

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            tourPackageService.savePackage(validPackage);
        });
        assertEquals("Finish date must be strictly after the start date", exception.getMessage());
    }

    @Test
    void savePackage_ActiveWithNoSpots_ThrowsIllegalArgumentException() {
        validPackage.setPackageStatus("ACTIVE");
        validPackage.setSpotsAvailable(0);

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            tourPackageService.savePackage(validPackage);
        });
        assertEquals("A package cannot be published as ACTIVE if there is not spots available", exception.getMessage());
    }

    @Test
    void savePackage_SoldOutWithSpots_ThrowsIllegalArgumentException() {
        validPackage.setPackageStatus("SOLD_OUT");
        validPackage.setSpotsAvailable(5);

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            tourPackageService.savePackage(validPackage);
        });
        assertEquals("A package cannot be published as SOLD OUT if there still spots available", exception.getMessage());
    }

    // ==========================================
    // 2. TESTS of getAllPackages
    // ==========================================

    @Test
    void getAllPackages_ReturnsListOfPackages() {
        when(packageRepository.findAll()).thenReturn(Arrays.asList(validPackage, new TourPackageEntity()));

        List<TourPackageEntity> packages = tourPackageService.getAllPackages();

        assertEquals(2, packages.size());
        verify(packageRepository, times(1)).findAll();
    }

    // ==========================================
    // 3. TESTS of getPackageById
    // ==========================================

    @Test
    void getPackageById_Exists_ReturnsPackage() {
        when(packageRepository.findById(1L)).thenReturn(Optional.of(validPackage));

        TourPackageEntity result = tourPackageService.getPackageById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getIdPackage());
    }

    @Test
    void getPackageById_NotFound_ThrowsRuntimeException() {
        when(packageRepository.findById(99L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            tourPackageService.getPackageById(99L);
        });
        assertEquals("Package not found", exception.getMessage());
    }

    // ==========================================
    // 4. TESTS of changeStatusPackage
    // ==========================================

    @Test
    void changeStatusPackage_Valid_UpdatesAndReturnsPackage() {
        when(packageRepository.findById(1L)).thenReturn(Optional.of(validPackage));
        when(packageRepository.save(any(TourPackageEntity.class))).thenReturn(validPackage);

        TourPackageEntity updatedPackage = tourPackageService.changeStatusPackage("INACTIVE", 1L);

        assertEquals("INACTIVE", updatedPackage.getPackageStatus());
        verify(packageRepository, times(1)).save(validPackage);
    }

    // ==========================================
    // 5. TESTS of updatePackage
    // ==========================================

    @Test
    void updatePackage_NoReservations_UpdatesSuccessfully() {
        TourPackageEntity updatedInfo = new TourPackageEntity();
        // We copy the basic data to pass validations
        updatedInfo.setPackageName("Updated Name");
        updatedInfo.setDestination("Cancun, Mexico");
        updatedInfo.setDescription("A wonderful trip to the beach.");
        updatedInfo.setStartDate(nextWeek); // we change the date
        updatedInfo.setFinishDate(new Date(nextWeek.getTime() + 86400000L));
        updatedInfo.setPrice(1500.0);
        updatedInfo.setSpotsAvailable(10);
        updatedInfo.setPackageStatus("ACTIVE");

        when(packageRepository.findById(1L)).thenReturn(Optional.of(validPackage));
        // We simulate an empty reservations list
        when(reservationRepository.findByIdPackage(1L)).thenReturn(List.of());
        when(packageRepository.save(any(TourPackageEntity.class))).thenReturn(validPackage);

        TourPackageEntity result = tourPackageService.updatePackage(1L, updatedInfo);

        assertEquals("Updated Name", result.getPackageName());
        assertEquals(nextWeek, result.getStartDate()); // The date was changed
        verify(packageRepository, times(1)).save(validPackage);
    }

    @Test
    @SuppressWarnings("unchecked")
    void updatePackage_WithReservationsAndChangedDates_ThrowsRuntimeException() {
        TourPackageEntity updatedInfo = new TourPackageEntity();
        updatedInfo.setStartDate(nextWeek); // We try to change the start date
        updatedInfo.setFinishDate(new Date(nextWeek.getTime() + 86400000L));

        when(packageRepository.findById(1L)).thenReturn(Optional.of(validPackage));

        // We simulate that there are reservations by creating a non-empty mock list
        List mockReservationsList = mock(List.class);
        when(mockReservationsList.isEmpty()).thenReturn(false);
        when(reservationRepository.findByIdPackage(1L)).thenReturn(mockReservationsList);

        Exception exception = assertThrows(RuntimeException.class, () -> {
            tourPackageService.updatePackage(1L, updatedInfo);
        });

        assertEquals("Cannot modify date of a package with reservations", exception.getMessage());
        verify(packageRepository, never()).save(any());
    }
}
