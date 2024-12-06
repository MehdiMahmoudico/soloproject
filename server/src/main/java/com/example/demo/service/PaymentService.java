package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.Payment;
import com.example.demo.model.PaymentStatus;
import com.example.demo.repository.PaymentRepository;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public Optional<Payment> getPaymentById(Long id) {
        return paymentRepository.findById(id);
    }

    public Optional<Payment> getPaymentByReservationId(Long reservationId) {
        return Optional.ofNullable(paymentRepository.findByReservationId(reservationId));
    }

    public List<Payment> getPaymentsByStatus(PaymentStatus status) {
        return paymentRepository.findByStatus(status);
    }

    public Payment savePayment(Payment payment) {
        return paymentRepository.save(payment);
    }

    public void deletePayment(Long id) {
        paymentRepository.deleteById(id);
    }

    public Payment updatePaymentStatus(Long paymentId, PaymentStatus status) {
        Optional<Payment> payment = paymentRepository.findById(paymentId);
        if (payment.isPresent()) {
            Payment pay = payment.get();
            pay.setStatus(status);
            return paymentRepository.save(pay);
        }
        throw new IllegalArgumentException("Payment not found");
    }
    public boolean processPayment(Payment payment) {
        // Here you would have actual payment processing logic
        // For simplicity, assume payment is successful if amount is greater than 0
        boolean isSuccessful = payment.getAmount() > 0;

        // Save payment with status based on success
        payment.setStatus(isSuccessful ? PaymentStatus.COMPLETED : PaymentStatus.FAILED);
        paymentRepository.save(payment);

        return isSuccessful;
    }
}

