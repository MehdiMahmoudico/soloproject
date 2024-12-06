package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.EmailRequest;
import com.example.demo.service.EmailSender;

@RestController
@CrossOrigin(origins = "http://localhost:3000") 
@RequestMapping("/email")
public class EmailController {

    @Autowired
    private EmailSender emailSender;

    // Endpoint to send email
    @PostMapping("/send")
    public String sendEmail(@RequestBody EmailRequest emailRequest) {
        return emailSender.sendEmail(emailRequest.getTo(), emailRequest.getSubject(), emailRequest.getHtmlContent());
    }
}
