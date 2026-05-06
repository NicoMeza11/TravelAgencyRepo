package com.travelagency.backend.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.travelagency.backend.Controller.dto.PackageRankingProjection;
import com.travelagency.backend.Controller.dto.SalesReportProjection;
import com.travelagency.backend.repository.ReservationRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

@ExtendWith(MockitoExtension.class)
public class ReportServiceTest {

    @Mock
    private ReservationRepository reservationRepository;

    @InjectMocks
    private ReportService reportService;

    private Date validStartDate;
    private Date validEndDate;

    @BeforeEach
    void setUp() {
        // Setup valid dates for happy paths
        // We use absolute milliseconds to guarantee startDate is strictly before endDate
        validStartDate = new Date(1000000000L);
        validEndDate = new Date(2000000000L);
    }

    // ==========================================
    // 1. TESTS FOR DATE VALIDATION (Shared Logic)
    // ==========================================

    @Test
    void validateDates_NullStartDate_ThrowsException() {
        // Act & Assert
        // We trigger the private validation method through the public getSalesReport method
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            reportService.getSalesReport(null, validEndDate);
        });

        assertEquals("End and start dates are mandatory", exception.getMessage());
        verify(reservationRepository, never()).findSalesReportByPeriod(any(), any());
    }

    @Test
    void validateDates_NullEndDate_ThrowsException() {
        // Act & Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            reportService.getSalesReport(validStartDate, null);
        });

        assertEquals("End and start dates are mandatory", exception.getMessage());
        verify(reservationRepository, never()).findSalesReportByPeriod(any(), any());
    }

    @Test
    void validateDates_StartDateAfterEndDate_ThrowsException() {
        // Arrange: Swap dates so start is after end
        Date start = new Date(2000000000L);
        Date end = new Date(1000000000L);

        // Act & Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            reportService.getSalesReport(start, end);
        });

        assertEquals("Start date cannot be after end date", exception.getMessage());
        verify(reservationRepository, never()).findSalesReportByPeriod(any(), any());
    }

    // ==========================================
    // 2. TESTS FOR getSalesReport
    // ==========================================

    @Test
    void getSalesReport_ValidDates_ReturnsList() {
        // Arrange
        // Since SalesReportProjection is likely an interface, we mock it
        SalesReportProjection mockProjection = mock(SalesReportProjection.class);
        List<SalesReportProjection> expectedList = Arrays.asList(mockProjection);

        when(reservationRepository.findSalesReportByPeriod(validStartDate, validEndDate))
                .thenReturn(expectedList);

        // Act
        List<SalesReportProjection> result = reportService.getSalesReport(validStartDate, validEndDate);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(reservationRepository, times(1)).findSalesReportByPeriod(validStartDate, validEndDate);
    }

    // ==========================================
    // 3. TESTS FOR getPackageRanking
    // ==========================================

    @Test
    void getPackageRanking_ValidDates_ReturnsList() {
        // Arrange
        // Mock the interface projection
        PackageRankingProjection mockProjection = mock(PackageRankingProjection.class);
        List<PackageRankingProjection> expectedList = Arrays.asList(mockProjection);

        when(reservationRepository.findPackageRankingByPeriod(validStartDate, validEndDate))
                .thenReturn(expectedList);

        // Act
        List<PackageRankingProjection> result = reportService.getPackageRanking(validStartDate, validEndDate);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(reservationRepository, times(1)).findPackageRankingByPeriod(validStartDate, validEndDate);
    }

}
