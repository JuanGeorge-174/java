package com.etracker.expensetracker.controller;

import com.etracker.expensetracker.dto.JwtResponse;
import com.etracker.expensetracker.dto.LoginRequest;
import com.etracker.expensetracker.security.jwt.JwtUtils;
import com.etracker.expensetracker.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtUtils jwtUtils;

    public AuthController(AuthenticationManager authenticationManager, UserService userService, JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody @Valid LoginRequest signUpRequest) {
        if (userService.userExists(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }
        userService.registerUser(signUpRequest.getUsername(), signUpRequest.getPassword());
        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
public ResponseEntity<?> signin(@RequestBody @Valid LoginRequest loginRequest) {
    try {
        System.out.println("=== Login Attempt ===");
        System.out.println("Username: " + loginRequest.getUsername());
        System.out.println("Password received: " + (loginRequest.getPassword() != null ? "yes" : "no"));
        
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        
        System.out.println("Authentication successful!");
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(loginRequest.getUsername());
        
        System.out.println("JWT generated successfully");
        return ResponseEntity.ok(new JwtResponse(jwt));
        
    } catch (AuthenticationException e) {
        System.out.println("Authentication failed: " + e.getClass().getSimpleName());
        System.out.println("Error message: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
    } catch (Exception e) {
        System.out.println("Unexpected error: " + e.getMessage());
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server error");
    }
}
}
