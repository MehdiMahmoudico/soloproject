package com.example.demo.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.example.demo.model.Reservation;
import com.example.demo.model.ReservationStatus;
import com.example.demo.repository.ClientRepository;
import com.example.demo.repository.ReservationRepository;
import com.example.demo.validation.CouponGenerator;

@Service
public class ReservationStatusUpdater {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private KonnectService konnectService;
    @Autowired
    private EmailSender emailSender;
    public String sendConfirmationEmail(Reservation reservation) {
        if (reservation.isEmailSent()) {
            return "Email already sent to client.";
        }

        // Generate a coupon code for the client
        String couponCode = CouponGenerator.generateCouponCode();
        
        // Create email content
        String emailContent = "<h1>Your reservation is confirmed!</h1>" +
                "<p>We are pleased to inform you that your reservation has been confirmed.</p>" +
                "<p> here is your coupon code: <strong>" + couponCode + "</strong></p>";

        // Send the email to the client
        String emailSubject = "Reservation Confirmation & Coupon Code";
        emailSender.sendEmail(reservation.getClient().getEmail(), emailSubject, emailContent);

        // Mark the reservation as having received the confirmation email
        reservation.setEmailSent(true);

        // Optionally, you can store the coupon code in the reservation or client for future use
        reservation.setCouponCode(couponCode);

        // Save the reservation after updating email sent status and coupon code
        reservationRepository.save(reservation);

        return "Confirmation email with coupon code sent successfully!";
    }
    @Scheduled(fixedRate = 60000) // Runs every 1 minute
    public void updateReservationStatuses() {
        List<Reservation> pendingReservations = reservationRepository.findByStatus(ReservationStatus.PENDING);

        for (Reservation reservation : pendingReservations) {
            Long clientId = reservation.getClient().getId();
            String paymentRef = clientRepository.findById(clientId)
                    .map(client -> client.getPaymentRef())
                    .orElse(null);

            if (paymentRef != null) {
                ResponseEntity<Object> paymentResponse = konnectService.getPaymentStatus(paymentRef);

                // Assuming the response body contains a 'data' object with a 'status' field
                if (paymentResponse.getBody() instanceof Map<?, ?> responseBody) {
                    // Check if 'payment' exists in the responseBody
                    if (responseBody.containsKey("payment")) {
                        Map<?, ?> paymentData = (Map<?, ?>) responseBody.get("payment");
                        
                        // get the status from the paymentData
                        String paymentStatus = (String) paymentData.get("status");

                        
                        if ("completed".equalsIgnoreCase(paymentStatus)) {
                            reservation.setStatus(ReservationStatus.CONFIRMED);
                            
                            reservationRepository.save(reservation);
                            System.out.println("Reservation " + reservation.getId() + " updated to CONFIRMED.");
                            // Call the method to send confirmation email with coupon code
                            String emailStatus = sendConfirmationEmail(reservation);
                            System.out.println(emailStatus);

                            System.out.println("Reservation " + reservation.getId() + " updated to CONFIRMED.");
                        } else {
                            System.out.println("Payment status is not completed: " + paymentStatus);
                        }
                    } else {
                        System.err.println("Response does not contain 'payment' field. Full response: " + responseBody);
                    }
                } else {
                    System.err.println("Payment response body is null or not a Map. Full response: " + paymentResponse.getBody());
                }
            }
        }
    }
    
}