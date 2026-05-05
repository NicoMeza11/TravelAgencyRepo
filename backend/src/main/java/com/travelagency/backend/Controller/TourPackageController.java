package com.travelagency.backend.Controller;

import com.travelagency.backend.entities.TourPackageEntity;
import com.travelagency.backend.service.TourPackageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tourpackage")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class TourPackageController {

    private final TourPackageService packageService;

    @GetMapping("/list")
    public List<TourPackageEntity> listAll(){
        return packageService.getAllPackages();
    }

    @GetMapping("/{idPackage}")
    public TourPackageEntity getPackageById(@PathVariable Long idPackage){
        return packageService.getPackageById(idPackage);
    }

    @PostMapping("/save")
    public ResponseEntity<TourPackageEntity> savePackage(@RequestBody TourPackageEntity packageEntity){
        TourPackageEntity savedPackage = packageService.savePackage(packageEntity);
        return new ResponseEntity<>(savedPackage, HttpStatus.CREATED);
    }

    @PutMapping("/changestatus/{idPackage}")
    public ResponseEntity<TourPackageEntity> changePackageStatus(@RequestParam String newStatus, @PathVariable Long idPackage){
        TourPackageEntity updatedPackage = packageService.changeStatusPackage(newStatus, idPackage);
        return ResponseEntity.ok(updatedPackage);
    }

    @PutMapping("/update/{idPackage}")
    public ResponseEntity<TourPackageEntity> updatePackage(@PathVariable Long idPackage, @RequestBody TourPackageEntity packageEntity) {
        TourPackageEntity updatedPackage = packageService.updatePackage(idPackage, packageEntity);
        return ResponseEntity.ok(updatedPackage);
    }
}
