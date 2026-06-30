package com.personalfinance.backend.controllers;

import com.personalfinance.backend.models.Debt;
import com.personalfinance.backend.repositories.DebtRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/debts")
public class DebtController {

    @Autowired
    private DebtRepository debtRepository;

    @GetMapping
    public ResponseEntity<?> getDebts() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        List<Debt> debts = debtRepository.findByUserIdOrderByDateDesc(userId);
        return ResponseEntity.ok(debts);
    }

    @PostMapping
    public ResponseEntity<?> createDebt(@RequestBody Debt request) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        request.setUserId(userId);
        request.setCreatedAt(new Date());
        request.setUpdatedAt(new Date());

        Debt saved = debtRepository.save(request);
        return ResponseEntity.status(201).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDebt(@PathVariable String id, @RequestBody Debt request) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Debt> opt = debtRepository.findById(id);

        if (opt.isEmpty() || !opt.get().getUserId().equals(userId)) {
            return ResponseEntity.status(404).body(Map.of("message", "Debt not found"));
        }

        Debt existing = opt.get();
        if (request.getName() != null) existing.setName(request.getName());
        if (request.getType() != null) existing.setType(request.getType());
        if (request.getAmount() > 0) existing.setAmount(request.getAmount());
        if (request.getDate() != null) existing.setDate(request.getDate());
        if (request.getDueDate() != null) existing.setDueDate(request.getDueDate());
        if (request.getInterestRate() >= 0) existing.setInterestRate(request.getInterestRate());
        
        // This handles toggle true/false explicitly if passed
        existing.setIsPaid(request.getIsPaid());
        
        existing.setUpdatedAt(new Date());
        Debt updated = debtRepository.save(existing);
        
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDebt(@PathVariable String id) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Debt> opt = debtRepository.findById(id);

        if (opt.isEmpty() || !opt.get().getUserId().equals(userId)) {
            return ResponseEntity.status(404).body(Map.of("message", "Debt not found"));
        }

        debtRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Debt deleted successfully"));
    }
}
