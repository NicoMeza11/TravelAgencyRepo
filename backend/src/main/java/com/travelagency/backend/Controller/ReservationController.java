package com.travelagency.backend.Controller;

import com.travelagency.backend.Controller.dto.ReservationRequestDTO;
import com.travelagency.backend.Controller.dto.ReservationResponseDTO;
import com.travelagency.backend.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reservation")
@RequiredArgsConstructor
@CrossOrigin(origins="http://localhost:5173")
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping("/save")
    public ResponseEntity<?> saveReservation(@RequestBody ReservationRequestDTO requestDTO) {

        System.out.println("Peticion recibida en el back");

        try{
            ReservationResponseDTO savedReservation = reservationService.createReservation(requestDTO);
            System.out.println("Reserva guardada exitosamente");
            return new ResponseEntity<>(savedReservation, HttpStatus.CREATED);
        }catch(Exception e){
            System.err.println("Error al guardar la reserva");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno: " + e.getMessage());        }
    }
}
