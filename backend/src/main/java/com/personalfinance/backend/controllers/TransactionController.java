package com.personalfinance.backend.controllers;

import com.personalfinance.backend.models.Transaction;
import com.personalfinance.backend.models.Category;
import com.personalfinance.backend.repositories.TransactionRepository;
import com.personalfinance.backend.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @PostMapping
    public ResponseEntity<?> createTransaction(@RequestBody Transaction request) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        request.setUserId(userId);
        request.setDate(request.getDate() == null ? new Date() : request.getDate());
        Transaction saved = transactionRepository.save(request);
        return ResponseEntity.status(201).body(saved);
    }

    @GetMapping
    public ResponseEntity<?> getTransactions(@RequestParam(defaultValue = "1") int page,
                                             @RequestParam(defaultValue = "10") int limit,
                                             @RequestParam(required = false) Integer month,
                                             @RequestParam(required = false) Integer year) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();

        List<Transaction> transactions = transactionRepository.findByUserIdOrderByDateDesc(userId);

        if (month != null && year != null) {
            transactions = transactions.stream()
                .filter(t -> {
                    java.util.Calendar cal = java.util.Calendar.getInstance();
                    cal.setTime(t.getDate());
                    return cal.get(java.util.Calendar.MONTH) + 1 == month &&
                           cal.get(java.util.Calendar.YEAR) == year;
                })
                .collect(Collectors.toList());
        }

        int total = transactions.size();
        int startIndex = (page - 1) * limit;
        int endIndex = Math.min(startIndex + limit, total);
        if (startIndex > total) startIndex = total;
        List<Transaction> paginated = transactions.subList(startIndex, endIndex);

        Set<String> catIds = paginated.stream().map(Transaction::getCategoryId).collect(Collectors.toSet());
        System.out.println("Requested Category IDs: " + catIds);
        
        List<Category> cats = categoryRepository.findAllById(catIds);
        System.out.println("Found Categories: " + cats.size());
        
        Map<String, Category> catMap = new HashMap<>();
        for (Category c : cats) {
            catMap.put(c.getId(), c);
        }
        
        List<Map<String, Object>> resultList = new ArrayList<>();
        for (Transaction t : paginated) {
            Map<String, Object> map = new HashMap<>();
            map.put("_id", t.getId());
            map.put("userId", t.getUserId());
            map.put("amount", t.getAmount());
            map.put("date", t.getDate());
            map.put("note", t.getNote());
            map.put("type", t.getType());
            Category c = catMap.get(t.getCategoryId());
            if (c != null) {
                Map<String, Object> cMap = new HashMap<>();
                cMap.put("_id", c.getId());
                cMap.put("name", c.getName());
                cMap.put("icon", c.getIcon());
                cMap.put("color", c.getColor());
                cMap.put("type", c.getType());
                map.put("categoryId", cMap);
            } else {
                map.put("categoryId", t.getCategoryId());
            }
            resultList.add(map);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("transactions", resultList);
        response.put("totalPages", (int) Math.ceil((double) total / limit));
        response.put("currentPage", page);
        response.put("total", total);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTransaction(@PathVariable String id, @RequestBody Transaction updates) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Transaction> tOpt = transactionRepository.findById(id);
        
        if (tOpt.isEmpty() || !tOpt.get().getUserId().equals(userId)) {
            return ResponseEntity.status(404).body(Map.of("message", "Transaction not found"));
        }
        
        Transaction t = tOpt.get();
        if (updates.getAmount() != 0) t.setAmount(updates.getAmount());
        if (updates.getCategoryId() != null) t.setCategoryId(updates.getCategoryId());
        if (updates.getDate() != null) t.setDate(updates.getDate());
        if (updates.getNote() != null) t.setNote(updates.getNote());
        if (updates.getType() != null) t.setType(updates.getType());
        
        transactionRepository.save(t);
        return ResponseEntity.ok(t);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTransaction(@PathVariable String id) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Transaction> tOpt = transactionRepository.findById(id);
        
        if (tOpt.isEmpty() || !tOpt.get().getUserId().equals(userId)) {
            return ResponseEntity.status(404).body(Map.of("message", "Transaction not found"));
        }
        
        transactionRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Transaction deleted successfully"));
    }
}
