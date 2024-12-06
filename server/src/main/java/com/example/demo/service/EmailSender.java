package com.example.demo.service;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import org.springframework.stereotype.Service;

@Service
public class EmailSender {
    private final String apiKey = "re_8tBxUEGL_46vWBukYNrdJJuhtb8pcGaYq"; // Use your actual API key

    public String sendEmail(String to, String subject, String htmlContent) {
        // Initialize Resend client with the API key
        Resend resend = new Resend(apiKey);

        // Create email parameters
        CreateEmailOptions params = CreateEmailOptions.builder()
                .from("Acme <onboarding@resend.dev>")  // Sender's email
                .to(to)                                 // Recipient's email (from request)
                .subject(subject)                       // Subject (from request)
                .html(htmlContent)                      // HTML content (from request)
                .build();

        try {
            // Send the email
            CreateEmailResponse data = resend.emails().send(params);

            // Return success message with email ID
            return "Email sent successfully! ID: " + data.getId();
        } catch (ResendException e) {
            // Handle errors
            return "Error sending email: " + e.getMessage();
        }
    }
}
