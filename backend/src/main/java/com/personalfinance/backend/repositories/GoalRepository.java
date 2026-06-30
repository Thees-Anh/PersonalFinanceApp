package com.personalfinance.backend.repositories;

import com.personalfinance.backend.models.Goal;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface GoalRepository extends MongoRepository<Goal, String> {
    List<Goal> findByUserIdOrderByCreatedAtDesc(String userId);
}
