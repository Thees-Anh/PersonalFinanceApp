package com.personalfinance.backend.repositories;

import com.personalfinance.backend.models.Debt;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface DebtRepository extends MongoRepository<Debt, String> {
    List<Debt> findByUserIdOrderByDateDesc(String userId);
}
