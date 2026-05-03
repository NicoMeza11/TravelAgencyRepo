package com.travelagency.backend.repository;

import com.travelagency.backend.entities.TourPackageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TourPackageRepository extends JpaRepository<TourPackageEntity, Long> {

}
