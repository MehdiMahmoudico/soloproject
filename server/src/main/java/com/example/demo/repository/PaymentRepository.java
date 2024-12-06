package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Payment;
import com.example.demo.model.PaymentStatus;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    // Find payments by reservation ID
    Payment findByReservationId(Long reservationId);

    // Find payments by status
    List<Payment> findByStatus(PaymentStatus status);
}
