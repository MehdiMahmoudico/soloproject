package com.example.demo.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Trip;

@Repository
public interface TripsPaginaRepository extends PagingAndSortingRepository<Trip, Long> {

}
