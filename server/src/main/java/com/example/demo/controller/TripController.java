package com.example.demo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.model.Trip;
import com.example.demo.service.TripService;

import jakarta.validation.Valid;






@RestController
@RequestMapping("/api/trips")
@CrossOrigin(origins = "http://localhost:3000")
public class TripController {

    @Autowired
    private TripService tripService;
   
    @GetMapping
    public List<Trip> getAllTrips() {
        return tripService.getAllTrips();
    }

    @PostMapping("/{tripId}/images")
    public ResponseEntity<Void> uploadImages(
            @PathVariable Long tripId,
            @RequestParam("images") List<MultipartFile> images) {
        try {
            tripService.addImagesToTrip(tripId, images);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @PutMapping("/{tripId}/images")
    public ResponseEntity<?> editImagesForTrip(
            @PathVariable Long tripId,
            @RequestParam(required = false) List<String> imagesToDelete,
            @RequestParam(required = false) List<MultipartFile> newImages) {
        try {
            // Call the service to edit images
            tripService.editImagesForTrip(tripId, newImages, imagesToDelete);
            return ResponseEntity.ok("Images updated successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating images: " + e.getMessage());
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<Trip> getTripById(@PathVariable Long id) {
        Optional<Trip> trip = tripService.getTripById(id);
        return trip.map(ResponseEntity::ok)
                   .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping("/create")
    public Trip createTrip(@Valid @RequestBody Trip trip) {
        return tripService.saveTrip(trip);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteTrip(@PathVariable Long id) {
        tripService.deleteTrip(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/search")
    public ResponseEntity<Page<Trip>> searchTrips(
            @RequestParam("destination") String destination,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        
        if (destination == null || destination.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Trip> trips = tripService.searchTripsByDestination(destination, pageable);
        return ResponseEntity.ok(trips);
    }
    @PutMapping("/edit/{id}")
    public ResponseEntity<Trip> updateTrip(@PathVariable Long id, @RequestBody Trip trip) {
        Optional<Trip> existingTrip = tripService.getTripById(id);
        if (existingTrip.isPresent()) {
            Trip updatedTrip = existingTrip.get();
            updatedTrip.setDestination(trip.getDestination());
            updatedTrip.setStartDate(trip.getStartDate());
            updatedTrip.setEndDate(trip.getEndDate());
            updatedTrip.setPrice(trip.getPrice());
            updatedTrip.setAvailableSeats(trip.getAvailableSeats());
            
            tripService.saveTrip(updatedTrip);
            
            return ResponseEntity.ok(updatedTrip);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }


}

