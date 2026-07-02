package com.personalfinance.backend.controllers;

import com.personalfinance.backend.models.Transaction;
import com.personalfinance.backend.models.User;
import com.personalfinance.backend.repositories.TransactionRepository;
import com.personalfinance.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/test-db")
public class TestDbController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @GetMapping("/debug")
    public Map<String, Object> debugDb() {
        Map<String, Object> response = new HashMap<>();
        
        List<User> users = userRepository.findAll();
        response.put("users_count", users.size());
        
        List<Map<String, Object>> userInfo = users.stream().map(u -> {
            Map<String, Object> info = new HashMap<>();
            info.put("email", u.getEmail());
            info.put("id", u.getId());
            info.put("roles", u.getRoles());
            List<Transaction> txs = transactionRepository.findByUserId(u.getId());
            info.put("transaction_count", txs.size());
            return info;
        }).toList();
        
        response.put("users", userInfo);
        return response;
    }
}
