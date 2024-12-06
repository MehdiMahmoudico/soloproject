package com.example.demo.service;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import com.example.demo.model.PaymentRequest;

@Service

public class KonnectService {

    private final String KONNECT_API_URL = "https://api.preprod.konnect.network/api/v2/payments/init-payment"; // For sandbox
    private final String API_KEY = "673537afbe3490452075a96f:U5PASk02ICMlFWTqD0XjaGMN"; // Replace with your actual API key

    public String initiatePayment(PaymentRequest paymentRequest) {
        RestTemplate restTemplate = new RestTemplate();

        // Configure headers
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-api-key", API_KEY);
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        

        // Create the request body
        HttpEntity<PaymentRequest> request = new HttpEntity<>(paymentRequest, headers);

        try {
            // Send POST request
            ResponseEntity<String> response = restTemplate.exchange(
                    KONNECT_API_URL,
                    HttpMethod.POST,
                    request,
                    String.class
                    
            );

            // Return the payment URL from the response
            return response.getBody();
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            // Handle client and server errors (e.g. 4xx and 5xx responses)
            System.err.println("Error Response: " + e.getResponseBodyAsString());
            return "Error occurred while processing the payment: " + e.getStatusCode();
        } catch (Exception e) {
            // Handle other unexpected exceptions
            System.err.println("Unexpected error: " + e.getMessage());
            return "Unexpected error occurred: " + e.getMessage();
        }
    }
    private final String KONNECT_API_URL2 = "https://api.preprod.konnect.network/api/v2/payments/"; // For sandbox
    // Method to get payment status by paymentId
    public ResponseEntity<Object> getPaymentStatus(String paymentId) {
        RestTemplate restTemplate = new RestTemplate();
        
        // Configure headers
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-api-key", API_KEY);
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Build the URL to check payment status
        String url = KONNECT_API_URL2 + "/" + paymentId;

        try {
            // Send GET request to get payment status
            ResponseEntity<Object> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    new HttpEntity<>(headers),
                    Object.class
            );

            return response; // Return the full response body (Payment details or Error)
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            // Handle client and server errors (e.g., 4xx and 5xx responses)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getResponseBodyAsString());
        } catch (Exception e) {
            // Handle other unexpected exceptions
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error: " + e.getMessage());
        }
    }
}
