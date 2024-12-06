package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.example.demo.model.Trip;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    // Find trips by destination
    List<Trip> findByDestination(String destination);
    
    // Find trips by available seats greater than zero
    List<Trip> findByAvailableSeatsGreaterThan(int seats);
    Page<Trip> findByDestinationContainingIgnoreCase(String destination, Pageable pageable);
}

