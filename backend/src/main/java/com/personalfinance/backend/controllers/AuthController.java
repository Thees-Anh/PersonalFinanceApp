package com.personalfinance.backend.controllers;

import com.personalfinance.backend.models.User;
import com.personalfinance.backend.repositories.UserRepository;
import com.personalfinance.backend.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import com.personalfinance.backend.models.ERole;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String email = request.get("email");
        String password = request.get("password");

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of("message", "User already exists"));
        }

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPasswordHash(encoder.encode(password));

        Set<ERole> roles = new HashSet<>();
        roles.add(ERole.ROLE_USER);
        user.setRoles(roles);

        userRepository.save(user);

        String token = jwtUtils.generateJwtToken(user.getId());

        Map<String, Object> userRes = new HashMap<>();
        userRes.put("id", user.getId());
        userRes.put("name", user.getName());
        userRes.put("email", user.getEmail());
        userRes.put("roles", user.getRoles());

        return ResponseEntity.status(201).body(Map.of("token", token, "user", userRes));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid credentials"));
        }

        User user = userOpt.get();
        if (!encoder.matches(password, user.getPasswordHash())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid credentials"));
        }

        if (user.isBanned()) {
            return ResponseEntity.status(403).body(Map.of("message", "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Admin."));
        }

        String token = jwtUtils.generateJwtToken(user.getId());

        // Tự động cấp ROLE_USER cho các tài khoản cũ chưa có field roles
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            Set<ERole> defaultRoles = new HashSet<>();
            defaultRoles.add(ERole.ROLE_USER);
            user.setRoles(defaultRoles);
            userRepository.save(user);
        }

        Map<String, Object> userRes = new HashMap<>();
        userRes.put("id", user.getId());
        userRes.put("name", user.getName());
        userRes.put("email", user.getEmail());
        userRes.put("roles", user.getRoles());

        return ResponseEntity.ok(Map.of("token", token, "user", userRes));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();

        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }

        User user = userOpt.get();
        if (name != null) {
            user.setName(name);
        }
        userRepository.save(user);

        Map<String, Object> userRes = new HashMap<>();
        userRes.put("id", user.getId());
        userRes.put("name", user.getName());
        userRes.put("email", user.getEmail());

        return ResponseEntity.ok(Map.of("user", userRes));
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request) {
        String oldPassword = request.get("oldPassword");
        String newPassword = request.get("newPassword");
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();

        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }

        User user = userOpt.get();
        if (!encoder.matches(oldPassword, user.getPasswordHash())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Incorrect old password"));
        }

        user.setPasswordHash(encoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
    }
}
