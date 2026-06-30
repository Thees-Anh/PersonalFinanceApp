package com.personalfinance.backend.repositories;

import com.personalfinance.backend.models.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TransactionRepository extends MongoRepository<Transaction, String> {
    List<Transaction> findByUserId(String userId);
    List<Transaction> findByUserIdOrderByDateDesc(String userId);
}
