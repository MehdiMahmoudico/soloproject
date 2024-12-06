package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.Reservation;
import com.example.demo.model.ReservationStatus;
import com.example.demo.repository.ClientRepository;
import com.example.demo.repository.ReservationRepository;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;
    @Autowired
    private ClientRepository clientRepository;

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public Optional<Reservation> getReservationById(Long id) {
        return reservationRepository.findById(id);
    }

    public List<Reservation> getReservationsByClientId(Long clientId) {
        return reservationRepository.findByClientId(clientId);
    }

    public List<Reservation> getReservationsByStatus(ReservationStatus status) {
        return reservationRepository.findByStatus(status);
    }

    public Reservation saveReservation(Reservation reservation) {
        return reservationRepository.save(reservation);
    }

    public void deleteReservation(Long id) {
        reservationRepository.deleteById(id);
    }

    public Reservation updateReservationStatus(Long reservationId, ReservationStatus status) {
        Optional<Reservation> reservationOptional = reservationRepository.findById(reservationId);

        if (reservationOptional.isPresent()) {
            Reservation reservation = reservationOptional.get();
            reservation.setStatus(status);
            return reservationRepository.save(reservation);
        } else {
            throw new IllegalArgumentException("Reservation not found");
        }
    }

    public String getPaymentRefByClientId(Long clientId) {
        // Assuming you have a method in your ClientRepository to find a client by ID
        return clientRepository.findById(clientId)
                .map(client -> client.getPaymentRef()) // Assuming getPaymentRef() returns the payment reference
                .orElse(null);
    }
    
}
