package com.personalfinance.backend.controllers;

import com.personalfinance.backend.models.Budget;
import com.personalfinance.backend.repositories.BudgetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    @Autowired
    private BudgetRepository budgetRepository;

    @PostMapping
    public ResponseEntity<?> createBudget(@RequestBody Budget request) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        
        List<Budget> existing = budgetRepository.findByUserIdAndMonthAndYear(userId, request.getMonth(), request.getYear());
        if (existing.stream().anyMatch(b -> b.getCategoryId().equals(request.getCategoryId()))) {
             return ResponseEntity.badRequest().body(Map.of("message", "Budget for this category already exists for the given month."));
        }

        request.setUserId(userId);
        Budget saved = budgetRepository.save(request);
        return ResponseEntity.status(201).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBudget(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Budget> bOpt = budgetRepository.findById(id);
        
        if (bOpt.isEmpty() || !bOpt.get().getUserId().equals(userId)) {
            return ResponseEntity.status(404).body(Map.of("message", "Budget not found"));
        }
        
        Budget b = bOpt.get();
        if (updates.containsKey("limitAmount")) {
            b.setLimitAmount(Double.parseDouble(updates.get("limitAmount").toString()));
        }
        budgetRepository.save(b);
        return ResponseEntity.ok(b);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBudget(@PathVariable String id) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Budget> bOpt = budgetRepository.findById(id);
        
        if (bOpt.isEmpty() || !bOpt.get().getUserId().equals(userId)) {
            return ResponseEntity.status(404).body(Map.of("message", "Budget not found"));
        }
        
        budgetRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Budget removed"));
    }
}
