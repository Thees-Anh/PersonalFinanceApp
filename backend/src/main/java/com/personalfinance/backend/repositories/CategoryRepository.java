package com.personalfinance.backend.repositories;

import com.personalfinance.backend.models.Category;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CategoryRepository extends MongoRepository<Category, String> {
    List<Category> findByType(String type);
}
