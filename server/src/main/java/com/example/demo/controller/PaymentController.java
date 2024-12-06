package com.example.demo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Payment;
import com.example.demo.model.PaymentRequest;
import com.example.demo.model.PaymentStatus;
import com.example.demo.model.ReservationStatus;
import com.example.demo.service.KonnectService;
import com.example.demo.service.PaymentService;
import com.example.demo.service.ReservationService;

@RestController
@RequestMapping(value ="/api/payments", produces = "application/json")
@CrossOrigin(origins = "http://localhost:3000") 
public class PaymentController {

    @Autowired
    private PaymentService paymentService;
    @Autowired
    private ReservationService reservationService;
    private final KonnectService konnectService;

    public PaymentController(KonnectService konnectService) {
        this.konnectService = konnectService;
    }
    @GetMapping
    public List<Payment> getAllPayments() {
        return paymentService.getAllPayments();
    }
    @PostMapping("/initiate")
    public ResponseEntity<String> initiatePayment(@RequestBody PaymentRequest paymentRequest) {
        String paymentUrl = konnectService.initiatePayment(paymentRequest);
        return ResponseEntity.ok(paymentUrl);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Long id) {
        Optional<Payment> payment = paymentService.getPaymentById(id);
        return payment.map(ResponseEntity::ok)
                      .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping
    public ResponseEntity<String> processPayment(@RequestBody Payment payment) {
        boolean isPaymentSuccessful = paymentService.processPayment(payment);

        if (isPaymentSuccessful) {
            // Retrieve the reservation ID through the Reservation object
            Long reservationId = payment.getReservation().getId();

            if (reservationId != null) {
                try {
                    reservationService.updateReservationStatus(reservationId, ReservationStatus.CONFIRMED);
                    return ResponseEntity.ok("Payment successful, reservation confirmed");
                } catch (Exception e) {
                    e.printStackTrace();
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Payment successful, but failed to confirm reservation");
                }
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Reservation ID not found in payment");
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Payment failed");
        }
    }
    
    

    @PutMapping("/{id}/statusazea")
    public ResponseEntity<Payment> updatePaymentStatus(@PathVariable Long id, @RequestBody PaymentStatus status) {
        try {
            Payment updatedPayment = paymentService.updatePaymentStatus(id, status);
            return ResponseEntity.ok(updatedPayment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    //@DeleteMapping("/{id}")
    //public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
      //  paymentService.deletePayment(id);
      //  return ResponseEntity.noContent().build();
    //}
    
    @GetMapping("/{paymentId}/status")
    public ResponseEntity<Object> getPaymentStatus(@PathVariable String paymentId) {
        ResponseEntity<Object> paymentDetails = konnectService.getPaymentStatus(paymentId);
        
        // Return the response from the service as it is
        return paymentDetails;
    }
}

