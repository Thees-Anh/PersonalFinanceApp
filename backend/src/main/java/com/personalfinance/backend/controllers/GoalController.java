package com.personalfinance.backend.controllers;

import com.personalfinance.backend.models.Goal;
import com.personalfinance.backend.models.GoalFund;
import com.personalfinance.backend.repositories.GoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/goals")
public class GoalController {

    @Autowired
    private GoalRepository goalRepository;

    // API: Lấy danh sách các mục tiêu tiết kiệm (Goals)
    @GetMapping
    public ResponseEntity<?> getGoals() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        List<Goal> goals = goalRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return ResponseEntity.ok(goals);
    }

    // API: Lấy chi tiết thông tin của một mục tiêu tiết kiệm
    @GetMapping("/{id}")
    public ResponseEntity<?> getGoal(@PathVariable String id) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Goal> gOpt = goalRepository.findById(id);

        if (gOpt.isEmpty() || !gOpt.get().getUserId().equals(userId)) {
            return ResponseEntity.status(404).body(Map.of("message", "Goal not found"));
        }
        return ResponseEntity.ok(gOpt.get());
    }

    // API: Tạo mới một mục tiêu tiết kiệm
    @PostMapping
    public ResponseEntity<?> createGoal(@RequestBody Goal request) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        request.setUserId(userId);
        request.setCreatedAt(new Date());
        request.setUpdatedAt(new Date());
        
        if (request.getCurrentAmount() >= request.getTargetAmount() && request.getTargetAmount() > 0) {
            request.setIsCompleted(true);
        } else {
            request.setIsCompleted(false);
        }

        Goal saved = goalRepository.save(request);
        return ResponseEntity.status(201).body(saved);
    }

    // API: Thêm/rút tiền (cập nhật quỹ) cho một mục tiêu tiết kiệm
    @PostMapping("/{id}/funds")
    public ResponseEntity<?> addFund(@PathVariable String id, @RequestBody GoalFund fundReq) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Goal> gOpt = goalRepository.findById(id);

        if (gOpt.isEmpty() || !gOpt.get().getUserId().equals(userId)) {
            return ResponseEntity.status(404).body(Map.of("message", "Goal not found"));
        }

        Goal goal = gOpt.get();
        if (fundReq.getDate() == null) {
            fundReq.setDate(new Date());
        }

        goal.getFunds().add(fundReq);
        goal.setCurrentAmount(goal.getCurrentAmount() + fundReq.getAmount());
        
        if (goal.getCurrentAmount() >= goal.getTargetAmount() && goal.getTargetAmount() > 0) {
            goal.setIsCompleted(true);
        }
        
        goal.setUpdatedAt(new Date());
        Goal updated = goalRepository.save(goal);

        return ResponseEntity.ok(updated);
    }

    // API: Xóa một mục tiêu tiết kiệm khỏi hệ thống
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGoal(@PathVariable String id) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Goal> gOpt = goalRepository.findById(id);

        if (gOpt.isEmpty() || !gOpt.get().getUserId().equals(userId)) {
            return ResponseEntity.status(404).body(Map.of("message", "Goal not found"));
        }

        goalRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Goal deleted successfully"));
    }
}
