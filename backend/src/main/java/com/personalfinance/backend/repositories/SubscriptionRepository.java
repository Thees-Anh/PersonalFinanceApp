package com.personalfinance.backend.repositories;

import com.personalfinance.backend.models.Subscription;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SubscriptionRepository extends MongoRepository<Subscription, String> {
    List<Subscription> findByUserIdOrderByNextPaymentDateAsc(String userId);
}
