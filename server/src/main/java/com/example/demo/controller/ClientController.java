package com.example.demo.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Client;
import com.example.demo.service.ClientService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "http://localhost:3000")
public class ClientController {

    @Autowired
    private ClientService clientService;

    @GetMapping
    public List<Client> getAllClients() {
        return clientService.getAllClients();
    }
    
    @GetMapping("/countByEmail")
    public Long getClientCountByEmail(@RequestParam String email) {
        return clientService.getClientCountByEmail(email);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Client> getClientById(@PathVariable Long id) {
        Optional<Client> client = clientService.getClientById(id);
        return client.map(ResponseEntity::ok)
                     .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/create")
    public ResponseEntity<?> createClient(@Valid @RequestBody Client client, BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            result.getFieldErrors().forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }
        Client savedClient = clientService.saveClient(client);
        return new ResponseEntity<>(savedClient, HttpStatus.CREATED);
    }

    //@DeleteMapping("/{id}")
    //public ResponseEntity<Void> deleteClient(@PathVariable Long id) {
        //clientService.deleteClient(id);
        //return ResponseEntity.noContent().build();
    //}
    @PutMapping("/{id}/payment-ref")
    public ResponseEntity<String> updatePaymentRef(
        @PathVariable Long id,
        @RequestBody Map<String, String> request) {
        // Validate input
        if (!request.containsKey("paymentRef") || request.get("paymentRef").isEmpty()) {
            return ResponseEntity.badRequest().body("Payment reference is required.");
        }

        String paymentRef = request.get("paymentRef");

        // Update the paymentRef using the service
        clientService.updatePaymentRef(id, paymentRef);
        return ResponseEntity.ok("Payment reference updated successfully.");
    }
}

