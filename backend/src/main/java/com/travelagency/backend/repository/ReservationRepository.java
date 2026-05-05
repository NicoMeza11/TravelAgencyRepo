package com.travelagency.backend.repository;

import com.travelagency.backend.Controller.dto.PackageRankingProjection;
import com.travelagency.backend.Controller.dto.SalesReportProjection;
import com.travelagency.backend.entities.ReservationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface ReservationRepository extends JpaRepository<ReservationEntity, Long> {

    long countByIdCustomerAndReservationStatus(String idCustomer, String reservationStatus);
    List<ReservationEntity> findByIdCustomer(String idCustomer);
    List<ReservationEntity> findByIdPackage(Long idPackage);

    //REPORT 1: Sales report by period
    @Query("SELECT r.date AS operationDate, " +
            "r.idCustomer AS clientName, " +
            "p.packageName AS packageName, " +
            "r.passengerQuantity AS passengerCount, " +
            "r.finalAmount AS totalAmount, " +
            "r.reservationStatus AS status " +
            "FROM ReservationEntity r, TourPackageEntity p " +
            "WHERE r.idPackage = p.idPackage " +
            "AND r.date BETWEEN :startDate AND :endDate " +
            "AND r.reservationStatus <> 'CANCELLED' " +
            "ORDER BY r.date ASC")
    List<SalesReportProjection> findSalesReportByPeriod(
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate);


    // REPORT 2: Package Ranking
    @Query("SELECT p.packageName AS packageName, " +
            "COUNT(r.idReservation) AS reservationCount, " +
            "SUM(r.passengerQuantity) AS totalPassengers, " +
            "SUM(r.finalAmount) AS totalAmountGenerated " +
            "FROM ReservationEntity r, TourPackageEntity p " +
            "WHERE r.idPackage = p.idPackage " +
            "AND r.date BETWEEN :startDate AND :endDate " +
            "AND r.reservationStatus <> 'CANCELLED' " +
            "GROUP BY p.idPackage, p.packageName " +
            "ORDER BY COUNT(r.idReservation) DESC, SUM(r.finalAmount) DESC")
    List<PackageRankingProjection> findPackageRankingByPeriod(
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate);
}
