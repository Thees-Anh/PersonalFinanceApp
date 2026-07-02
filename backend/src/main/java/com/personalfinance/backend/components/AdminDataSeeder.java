package com.personalfinance.backend.components;

import com.personalfinance.backend.models.ERole;
import com.personalfinance.backend.models.User;
import com.personalfinance.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class AdminDataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        String adminEmail = "admin@personalfinance.com";
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = new User();
            admin.setName("System Admin");
            admin.setEmail(adminEmail);
            admin.setPasswordHash(passwordEncoder.encode("admin123"));

            Set<ERole> roles = new HashSet<>();
            roles.add(ERole.ROLE_ADMIN);
            roles.add(ERole.ROLE_USER); // Admin cũng nên có quyền User để dùng các chức năng cơ bản
            admin.setRoles(roles);

            userRepository.save(admin);
            System.out.println("====== Admin account created successfully! ======");
            System.out.println("Email: " + adminEmail);
            System.out.println("Password: admin123");
            System.out.println("=================================================");
        } else {
            System.out.println("====== Admin account already exists. ======");
        }
    }
}
