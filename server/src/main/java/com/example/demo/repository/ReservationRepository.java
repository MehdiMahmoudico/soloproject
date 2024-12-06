package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Reservation;
import com.example.demo.model.ReservationStatus;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    // Find reservations by client
    List<Reservation> findByClientId(Long clientId);

    // Find reservations by status
    List<Reservation> findByStatus(ReservationStatus status);

    // Find reservations by trip
    List<Reservation> findByTripId(Long tripId);
    
}

