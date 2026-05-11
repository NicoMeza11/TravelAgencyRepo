package com.travelagency.backend.Controller;

import com.travelagency.backend.Controller.dto.ReservationRequestDTO;
import com.travelagency.backend.Controller.dto.ReservationResponseDTO;
import com.travelagency.backend.entities.ReservationEntity;
import com.travelagency.backend.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservation")
@RequiredArgsConstructor
@CrossOrigin(origins={"http://localhost:5173", "http://localhost:8070","http://18.230.122.69:8070"})
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping("/save")
    public ResponseEntity<?> saveReservation(@RequestBody ReservationRequestDTO requestDTO) {

        try{
            ReservationResponseDTO savedReservation = reservationService.createReservation(requestDTO);
            System.out.println("Reserva guardada exitosamente");
            return new ResponseEntity<>(savedReservation, HttpStatus.CREATED);
        }catch(Exception e){
            System.err.println("Error al guardar la reserva");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno: " + e.getMessage());        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReservationEntity>> getAllReservationUser(@PathVariable String userId){
        List<ReservationEntity> reservations = reservationService.getAllReservationUser(userId);
        if(reservations.isEmpty()){
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/allreservation")
    public ResponseEntity<List<ReservationEntity>> getAllReservation(){
        List<ReservationEntity> reservations = reservationService.getAllReservation();
        return ResponseEntity.ok(reservations);
    }

    @PutMapping("/cancel/{idReservation}")
    public ResponseEntity<Void> cancelReservation(@PathVariable Long idReservation){

        reservationService.cancelReservation(idReservation);
        return ResponseEntity.ok().build();
    }
}
