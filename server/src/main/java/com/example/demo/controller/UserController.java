package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.AuthResponse;
import com.example.demo.model.User;
import com.example.demo.service.JwtUtil;
import com.example.demo.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final JwtUtil jwtUtil;

    public UserController(UserService userService, BCryptPasswordEncoder bCryptPasswordEncoder, JwtUtil jwtUtil) {
        this.userService = userService;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody User user, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(result.getAllErrors());
        }
        try {
        	  if (userService.usernameExists(user.getUsername())) {
                  return ResponseEntity.badRequest().body("Username is already taken. Please choose a different one.");
              }
            userService.saveWithUserRole(user);
            return ResponseEntity.ok("User registered successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An error occurred: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        User foundUser  = userService.findByUsername(user.getUsername());
        if (foundUser  == null || !bCryptPasswordEncoder.matches(user.getPassword(), foundUser .getPassword())) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }

        String role = foundUser .getRoles().stream().anyMatch(r -> r.getName().equals("ROLE_ADMIN")) ? "ROLE_ADMIN" : "ROLE_USER";
        String token = jwtUtil.generateToken(foundUser .getUsername(), role);
        
        return ResponseEntity.ok(new AuthResponse(token)); 
    }
}
