package com.travelagency.backend.Controller;

import com.travelagency.backend.Controller.dto.PaymentRequestDTO;
import com.travelagency.backend.entities.PaymentEntity;
import com.travelagency.backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@CrossOrigin(origins={"http://localhost:5173", "http://localhost:8070","http://18.230.122.69:8070"})
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/save")
    public ResponseEntity<PaymentEntity> savePayment(@RequestBody PaymentRequestDTO paymentRequestDTO){

        PaymentEntity payment = paymentService.processPayment(paymentRequestDTO);
        return new ResponseEntity<>(payment, HttpStatus.CREATED);
    }
}
