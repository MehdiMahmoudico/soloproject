package com.example.demo.service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.model.Trip;
import com.example.demo.repository.TripRepository;
import com.example.demo.repository.TripsPaginaRepository;

@Service
public class TripService {

    @Autowired
    private TripRepository tripRepository;
    @Autowired
    private TripsPaginaRepository tripsPaginaRepository;

    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }

    public Optional<Trip> getTripById(Long id) {
        return tripRepository.findById(id);
    }
    public Page<Trip> searchTripsByDestination(String destination, Pageable pageable) {
        return tripRepository.findByDestinationContainingIgnoreCase(destination, pageable);
    }

    public List<Trip> getTripsByDestination(String destination) {
        return tripRepository.findByDestination(destination);
    }

    public List<Trip> getTripsWithAvailableSeats() {
        return tripRepository.findByAvailableSeatsGreaterThan(0);
    }

    public Trip saveTrip(Trip trip) {
        return tripRepository.save(trip);
    }

    public void deleteTrip(Long id) {
        tripRepository.deleteById(id);
    }
    private static final int PAGE_SIZE = 5;
    public Page<Trip> tripsPerPage(int pageNumber) {
        PageRequest pageRequest = PageRequest.of(pageNumber, PAGE_SIZE, Sort.Direction.ASC, "id");
        Page<Trip> ninjas = tripsPaginaRepository.findAll(pageRequest);
        return tripsPaginaRepository.findAll(pageRequest);
    }
    @Value("${upload.path}")
    private String uploadPath;

   

    public void addImagesToTrip(Long tripId, List<MultipartFile> images) throws Exception {
        Trip trip = tripRepository.findById(tripId)
            .orElseThrow(() -> new RuntimeException("Trip not found"));

        Path uploadDir = Paths.get(uploadPath);
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir); 
        }

        List<String> imageUrls = new ArrayList<>();
        for (MultipartFile image : images) {
            String filename = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
            Path filePath = uploadDir.resolve(filename); 
            Files.copy(image.getInputStream(), filePath); 

            imageUrls.add(filename); 
        }

        trip.setImages(imageUrls);
        
        if (trip.getStartDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Start date cannot be in the past.");
        }

        if (trip.getEndDate().isBefore(trip.getStartDate())) {
            throw new IllegalArgumentException("End date cannot be before the start date.");
        }
        tripRepository.save(trip);
    }
    public void editImagesForTrip(Long tripId, List<MultipartFile> newImages, List<String> imagesToDelete) throws Exception {
        // Fetch the trip
        Trip trip = tripRepository.findById(tripId)
            .orElseThrow(() -> new RuntimeException("Trip not found"));

        Path uploadDir = Paths.get(uploadPath);
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

        // Handle deletions
        if (imagesToDelete != null && !imagesToDelete.isEmpty()) {
            for (String image : imagesToDelete) {
                // Remove image from file system
                Path filePath = uploadDir.resolve(image);
                if (Files.exists(filePath)) {
                    Files.delete(filePath);
                }
            }
        }

        // Prepare the list of current images
        List<String> updatedImageUrls = new ArrayList<>(trip.getImages());

        // Handle new image uploads
        if (newImages != null && !newImages.isEmpty()) {
            for (MultipartFile image : newImages) {
                String filename = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
                Path filePath = uploadDir.resolve(filename);
                Files.copy(image.getInputStream(), filePath);

                updatedImageUrls.add(filename);  // Add the new image filename to the list
            }
        }

        // Set the updated image list for the trip
        trip.setImages(updatedImageUrls);

        // Optional: Validate start and end dates
        if (trip.getStartDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Start date cannot be in the past.");
        }

        if (trip.getEndDate().isBefore(trip.getStartDate())) {
            throw new IllegalArgumentException("End date cannot be before the start date.");
        }

        // Save the updated trip to the database
        tripRepository.save(trip);
    }


}
