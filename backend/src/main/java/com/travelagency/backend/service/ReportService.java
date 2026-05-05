package com.travelagency.backend.service;

import com.travelagency.backend.Controller.dto.PackageRankingProjection;
import com.travelagency.backend.Controller.dto.SalesReportProjection;
import com.travelagency.backend.repository.ReservationRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class ReportService {

    private final ReservationRepository reservationRepository;

    public ReportService(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    public List<SalesReportProjection> getSalesReport(Date startDate, Date endDate) {
        validateDates(startDate, endDate);
        return reservationRepository.findSalesReportByPeriod(startDate, endDate);
    }

    public List<PackageRankingProjection> getPackageRanking(Date startDate, Date endDate) {
        validateDates(startDate, endDate);
        return reservationRepository.findPackageRankingByPeriod(startDate, endDate);
    }

    private void validateDates(Date startDate, Date endDate) {
        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException("End and start dates are mandatory");
        }
        if (startDate.after(endDate)) {
            throw new IllegalArgumentException("Start date cannot be after end date");
        }
    }
}
