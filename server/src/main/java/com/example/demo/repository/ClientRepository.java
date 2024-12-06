package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;

import com.example.demo.model.Client;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    
    @Query("SELECT COUNT(c) FROM Client c WHERE c.email = :email")
    Long countByEmail(String email);
}
