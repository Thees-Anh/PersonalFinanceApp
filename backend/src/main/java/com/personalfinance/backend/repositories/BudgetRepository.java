package com.personalfinance.backend.repositories;

import com.personalfinance.backend.models.Budget;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface BudgetRepository extends MongoRepository<Budget, String> {
    List<Budget> findByUserId(String userId);
    List<Budget> findByUserIdAndMonthAndYear(String userId, int month, int year);
}
