package com.travelagency.backend.service;

import com.travelagency.backend.entities.TourPackageEntity;
import com.travelagency.backend.repository.TourPackageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TourPackageService {

    private final TourPackageRepository packageRepository;

    private void validateBusinessRules(TourPackageEntity packageEntity){
        if(packageEntity.getPrice() <= 0){
            throw new IllegalArgumentException("The price must be greater than zero");
        }

        if(packageEntity.getSpotsAvailable() < 0){
            throw new IllegalArgumentException("Total spots cannot be negative");
        }

        if(packageEntity.getFinishDate().before(packageEntity.getStartDate()) ||
           packageEntity.getFinishDate().equals(packageEntity.getStartDate())){
            throw new IllegalArgumentException("Finish date must be strictly after the start date");
        }

        if("ACTIVE".equalsIgnoreCase(packageEntity.getPackageStatus()) && packageEntity.getSpotsAvailable() <= 0){
            throw new IllegalArgumentException("A package cannot be published as ACTIVE if there is not spots available");
        }

        if("SOLD OUT".equalsIgnoreCase(packageEntity.getPackageStatus()) && packageEntity.getSpotsAvailable() > 0){
            throw new IllegalArgumentException("A package cannot be published as SOLD OUT if there still spots available");
        }
    }

    public TourPackageEntity savePackage(TourPackageEntity packageEntity){

        validateBusinessRules(packageEntity); //we first validate de business rules before save the package
        log.info("Saving new package: {}", packageEntity.getPackageName());
        return packageRepository.save(packageEntity);
    }

    public List<TourPackageEntity> getAllPackages(){
        return packageRepository.findAll();
    }

    public TourPackageEntity changeStatusPackage(String newStatus, Long idPackage){
        TourPackageEntity tourPackage = packageRepository.findById(idPackage)
                        .orElseThrow(() -> new RuntimeException("Package not found with id: " + idPackage));

        tourPackage.setPackageStatus(newStatus);
        validateBusinessRules(tourPackage);
        log.info("The package {} now has {} status", tourPackage.getIdPackage(), tourPackage.getPackageStatus());
        return packageRepository.save(tourPackage);
    }

    public TourPackageEntity updatePackage(Long idPackage, TourPackageEntity updatedPackage){

        TourPackageEntity existingPackage = packageRepository.findById(idPackage)
                .orElseThrow(() -> new RuntimeException(("Package not found with id:" + idPackage)));

        existingPackage.setPackageName(updatedPackage.getPackageName());
        existingPackage.setDestination(updatedPackage.getDestination());
        existingPackage.setDescription(updatedPackage.getDescription());
        existingPackage.setStartDate(updatedPackage.getStartDate());
        existingPackage.setFinishDate(updatedPackage.getFinishDate());
        existingPackage.setPrice(updatedPackage.getPrice());
        existingPackage.setSpotsAvailable(updatedPackage.getSpotsAvailable());
        existingPackage.setUrlImagen(updatedPackage.getUrlImagen());
        existingPackage.setIncludedServices(updatedPackage.getIncludedServices());
        existingPackage.setConditions(updatedPackage.getConditions());
        existingPackage.setRestrictions(updatedPackage.getRestrictions());
        existingPackage.setTravelType(updatedPackage.getTravelType());
        existingPackage.setSeason(updatedPackage.getSeason());

        validateBusinessRules(existingPackage); //we validate de business rules of the updates package

        return packageRepository.save(existingPackage);
    }
}
