package com.personalfinance.backend.controllers;

import com.personalfinance.backend.models.*;
import com.personalfinance.backend.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private BudgetRepository budgetRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping("/summary")
    public ResponseEntity<?> getMonthlySummary(
            @RequestParam Integer month,
            @RequestParam Integer year) {

        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        
        Calendar cal = Calendar.getInstance();
        cal.set(year, month - 1, 1, 0, 0, 0);
        Date start = cal.getTime();
        cal.set(year, month, 0, 23, 59, 59);
        Date end = cal.getTime();

        List<Transaction> txs = transactionRepository.findByUserId(userId).stream()
            .filter(t -> t.getDate() != null && t.getDate().compareTo(start) >= 0 && t.getDate().compareTo(end) <= 0)
            .collect(Collectors.toList());

        double totalIncome = txs.stream().filter(t -> "income".equals(t.getType())).mapToDouble(Transaction::getAmount).sum();
        double totalExpense = txs.stream().filter(t -> "expense".equals(t.getType())).mapToDouble(Transaction::getAmount).sum();

        Map<String, Category> categories = categoryRepository.findAll().stream().collect(Collectors.toMap(Category::getId, c -> c));

        Map<String, Double> expensesByCategory = txs.stream()
            .filter(t -> "expense".equals(t.getType()))
            .collect(Collectors.groupingBy(Transaction::getCategoryId, Collectors.summingDouble(Transaction::getAmount)));

        List<Map<String, Object>> breakdown = new ArrayList<>();
        for (Map.Entry<String, Double> e : expensesByCategory.entrySet()) {
            Category c = categories.get(e.getKey());
            Map<String, Object> map = new HashMap<>();
            map.put("categoryId", e.getKey());
            map.put("total", e.getValue());
            if (c != null) {
                map.put("categoryName", c.getName());
                map.put("categoryIcon", c.getIcon());
                map.put("categoryColor", c.getColor());
            } else {
                map.put("categoryName", "Unknown");
                map.put("categoryIcon", "help-outline");
                map.put("categoryColor", "#999999");
            }
            breakdown.add(map);
        }
        breakdown.sort((a, b) -> Double.compare((Double) b.get("total"), (Double) a.get("total")));

        return ResponseEntity.ok(Map.of("totalIncome", totalIncome, "totalExpense", totalExpense, "expenseBreakdown", breakdown));
    }

    @GetMapping("/budgets")
    public ResponseEntity<?> getBudgetStatus(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {

        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        if (month == null || year == null) {
            Calendar now = Calendar.getInstance();
            month = now.get(Calendar.MONTH) + 1;
            year = now.get(Calendar.YEAR);
        }

        List<Budget> budgets = budgetRepository.findByUserIdAndMonthAndYear(userId, month, year);
        if (budgets.isEmpty()) return ResponseEntity.ok(Collections.emptyList());

        Calendar cal = Calendar.getInstance();
        cal.set(year, month - 1, 1, 0, 0, 0);
        Date start = cal.getTime();
        cal.set(year, month, 0, 23, 59, 59);
        Date end = cal.getTime();

        List<Transaction> expenses = transactionRepository.findByUserId(userId).stream()
            .filter(t -> "expense".equals(t.getType()) && t.getDate() != null && t.getDate().compareTo(start) >= 0 && t.getDate().compareTo(end) <= 0)
            .collect(Collectors.toList());

        Map<String, Double> spentMap = expenses.stream()
            .collect(Collectors.groupingBy(Transaction::getCategoryId, Collectors.summingDouble(Transaction::getAmount)));

        Map<String, Category> categories = categoryRepository.findAll().stream().collect(Collectors.toMap(Category::getId, c -> c));

        List<Map<String, Object>> result = new ArrayList<>();
        for (Budget b : budgets) {
            double spent = spentMap.getOrDefault(b.getCategoryId(), 0.0);
            Map<String, Object> map = new HashMap<>();
            map.put("budgetId", b.getId());
            map.put("category", categories.get(b.getCategoryId()));
            map.put("limitAmount", b.getLimitAmount());
            map.put("spentAmount", spent);
            map.put("remainingAmount", b.getLimitAmount() - spent);
            map.put("percentageUsed", b.getLimitAmount() > 0 ? (spent / b.getLimitAmount()) * 100 : 0);
            result.add(map);
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/weekly-trends")
    public ResponseEntity<?> getWeeklyTrends() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        
        Calendar cal = Calendar.getInstance();
        Date endDate = cal.getTime();
        cal.add(Calendar.DAY_OF_YEAR, -6);
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        Date startDate = cal.getTime();

        List<Transaction> txs = transactionRepository.findByUserId(userId).stream()
            .filter(t -> t.getDate() != null && t.getDate().compareTo(startDate) >= 0 && t.getDate().compareTo(endDate) <= 0)
            .collect(Collectors.toList());

        List<Map<String, Object>> result = new ArrayList<>();
        java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyy-MM-dd");
        java.text.SimpleDateFormat dayFormat = new java.text.SimpleDateFormat("EEE", Locale.US);

        for (int i = 0; i <= 6; i++) {
            Calendar d = Calendar.getInstance();
            d.setTime(startDate);
            d.add(Calendar.DAY_OF_YEAR, i);
            String dateStr = sdf.format(d.getTime());
            
            double income = txs.stream().filter(t -> "income".equals(t.getType()) && sdf.format(t.getDate()).equals(dateStr)).mapToDouble(Transaction::getAmount).sum();
            double expense = txs.stream().filter(t -> "expense".equals(t.getType()) && sdf.format(t.getDate()).equals(dateStr)).mapToDouble(Transaction::getAmount).sum();

            Map<String, Object> map = new HashMap<>();
            map.put("date", dateStr);
            map.put("dayName", dayFormat.format(d.getTime()));
            map.put("income", income);
            map.put("expense", expense);
            result.add(map);
        }
        return ResponseEntity.ok(result);
    }
}
