package com.personalfinance.backend.controllers;

import com.personalfinance.backend.models.Subscription;
import com.personalfinance.backend.repositories.SubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/subs")
public class SubscriptionController {

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @GetMapping
    public ResponseEntity<?> getSubscriptions() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        List<Subscription> subs = subscriptionRepository.findByUserIdOrderByNextPaymentDateAsc(userId);
        return ResponseEntity.ok(subs);
    }

    @PostMapping
    public ResponseEntity<?> createSubscription(@RequestBody Subscription request) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        request.setUserId(userId);
        request.setCreatedAt(new Date());
        request.setUpdatedAt(new Date());

        Subscription saved = subscriptionRepository.save(request);
        return ResponseEntity.status(201).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSubscription(@PathVariable String id, @RequestBody Subscription request) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Subscription> opt = subscriptionRepository.findById(id);

        if (opt.isEmpty() || !opt.get().getUserId().equals(userId)) {
            return ResponseEntity.status(404).body(Map.of("message", "Subscription not found"));
        }

        Subscription existing = opt.get();
        if (request.getName() != null) existing.setName(request.getName());
        if (request.getAmount() > 0) existing.setAmount(request.getAmount());
        if (request.getCycle() != null) existing.setCycle(request.getCycle());
        if (request.getNextPaymentDate() != null) existing.setNextPaymentDate(request.getNextPaymentDate());
        if (request.getColor() != null) existing.setColor(request.getColor());
        if (request.getIcon() != null) existing.setIcon(request.getIcon());
        
        existing.setUpdatedAt(new Date());
        Subscription updated = subscriptionRepository.save(existing);
        
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSubscription(@PathVariable String id) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Subscription> opt = subscriptionRepository.findById(id);

        if (opt.isEmpty() || !opt.get().getUserId().equals(userId)) {
            return ResponseEntity.status(404).body(Map.of("message", "Subscription not found"));
        }

        subscriptionRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Subscription deleted successfully"));
    }
}
