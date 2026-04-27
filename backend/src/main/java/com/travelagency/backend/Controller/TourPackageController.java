package com.travelagency.backend.Controller;

import com.travelagency.backend.entities.TourPackageEntity;
import com.travelagency.backend.repository.TourPackageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tourpackage")
@CrossOrigin(origins = "http://localhost:5173")
public class TourPackageController {

    @Autowired
    private TourPackageRepository packageRepo;

    public List<TourPackageEntity> listAll(){
        return packageRepo.findAll();
    }
}
