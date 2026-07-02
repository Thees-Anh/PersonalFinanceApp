package com.personalfinance.backend.controllers;

import com.personalfinance.backend.models.User;
import com.personalfinance.backend.models.Announcement;
import com.personalfinance.backend.repositories.GoalRepository;
import com.personalfinance.backend.repositories.TransactionRepository;
import com.personalfinance.backend.repositories.UserRepository;
import com.personalfinance.backend.repositories.AnnouncementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private AnnouncementRepository announcementRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> getSystemStats() {
        long totalUsers = userRepository.count();
        long totalTransactions = transactionRepository.count();
        long totalGoals = goalRepository.count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("totalTransactions", totalTransactions);
        stats.put("totalGoals", totalGoals);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers(@RequestParam(required = false) String search) {
        List<User> users;
        if (search != null && !search.trim().isEmpty()) {
            users = userRepository.findByEmailContainingIgnoreCase(search.trim());
        } else {
            users = userRepository.findAll();
        }
        
        // Xóa thông tin nhạy cảm trước khi trả về cho Frontend
        users.forEach(user -> user.setPasswordHash(null));
        return ResponseEntity.ok(users);
    }

    @PutMapping("/users/{id}/ban")
    public ResponseEntity<?> toggleBanUser(@PathVariable String id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "User not found"));
        }

        User user = userOpt.get();
        // Không cho phép Admin tự khóa chính mình
        if (user.getRoles() != null && user.getRoles().contains(com.personalfinance.backend.models.ERole.ROLE_ADMIN)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Cannot ban an Admin account"));
        }

        user.setBanned(!user.isBanned());
        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
            "message", user.isBanned() ? "User banned successfully" : "User unbanned successfully",
            "isBanned", user.isBanned()
        ));
    }

    @GetMapping("/announcements")
    public ResponseEntity<List<Announcement>> getAdminAnnouncements() {
        return ResponseEntity.ok(announcementRepository.findAllByOrderByCreatedAtDesc());
    }

    @PostMapping("/announcements")
    public ResponseEntity<Announcement> createAnnouncement(@RequestBody Announcement announcement) {
        announcement.setCreatedAt(new java.util.Date());
        return ResponseEntity.ok(announcementRepository.save(announcement));
    }

    @DeleteMapping("/announcements/{id}")
    public ResponseEntity<?> deleteAnnouncement(@PathVariable String id) {
        announcementRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Announcement deleted successfully"));
    }
}
