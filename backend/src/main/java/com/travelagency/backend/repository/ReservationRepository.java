package com.travelagency.backend.repository;

import com.travelagency.backend.entities.ReservationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationRepository extends JpaRepository<ReservationEntity, Long> {

    long countByIdCustomerAndReservationStatus(String idCustomer, String reservationStatus);

    List<ReservationEntity> findByIdCustomer(String idCustomer);

    List<ReservationEntity> findByIdPackage(Long idPackage);
}
