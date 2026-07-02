package com.personalfinance.backend;

import com.personalfinance.backend.models.Transaction;
import com.personalfinance.backend.models.User;
import com.personalfinance.backend.repositories.TransactionRepository;
import com.personalfinance.backend.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class DbTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Test
    void inspectDb() {
        System.out.println("====== DB INSPECTION ======");
        List<User> users = userRepository.findAll();
        System.out.println("Total Users: " + users.size());
        for (User u : users) {
            System.out.println("User: " + u.getEmail() + " | ID: " + u.getId() + " | Roles: " + u.getRoles());
            List<Transaction> txs = transactionRepository.findByUserId(u.getId());
            System.out.println("  Transactions: " + txs.size());
            if (!txs.isEmpty()) {
                System.out.println("  First TX Date: " + txs.get(0).getDate());
            }
        }
        System.out.println("===========================");
    }
}
