package com.transit.repository;

import com.transit.model.FavoriteRoute;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface FavoriteRepository extends MongoRepository<FavoriteRoute, String> {
    List<FavoriteRoute> findAllByOrderByCreatedAtDesc();
}
