package com.etracker.expensetracker.controller;

import com.etracker.expensetracker.model.User;
import com.etracker.expensetracker.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", allowCredentials = "true")
public class UserSettingsController {
    private final UserService userService;

    @GetMapping("/settings")
    public ResponseEntity<Map<String, Object>> getSettings() {
        try {
            User user = userService.getCurrentUser()
                    .orElseThrow(() -> new RuntimeException("User not authenticated"));

            Map<String, Object> settings = new HashMap<>();
            settings.put("monthlyBudgetLimit", user.getMonthlyBudgetLimit());
            
            return ResponseEntity.ok(settings);
        } catch (Exception e) {
            System.err.println("Error fetching settings: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @PutMapping("/settings")
    public ResponseEntity<Map<String, Object>> updateSettings(@RequestBody Map<String, Object> request) {
        try {
            User user = userService.getCurrentUser()
                    .orElseThrow(() -> new RuntimeException("User not authenticated"));

            if (request.containsKey("monthlyBudgetLimit")) {
                Object limitObj = request.get("monthlyBudgetLimit");
                Double limit = null;
                if (limitObj instanceof Number) {
                    limit = ((Number) limitObj).doubleValue();
                }
                user.setMonthlyBudgetLimit(limit);
                userService.save(user);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Settings updated successfully");
            response.put("monthlyBudgetLimit", user.getMonthlyBudgetLimit());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error updating settings: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}
