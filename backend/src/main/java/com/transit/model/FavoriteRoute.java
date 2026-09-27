package com.transit.model;

import jakarta.validation.constraints.NotBlank;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "favorite_routes")
public class FavoriteRoute {

    @Id
    private String id;

    @NotBlank
    private String fromStation;

    @NotBlank
    private String toStation;

    @CreatedDate
    private Instant createdAt;

    public FavoriteRoute() {
    }

    public FavoriteRoute(String id, String fromStation, String toStation, Instant createdAt) {
        this.id = id;
        this.fromStation = fromStation;
        this.toStation = toStation;
        this.createdAt = createdAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFromStation() {
        return fromStation;
    }

    public void setFromStation(String fromStation) {
        this.fromStation = fromStation;
    }

    public String getToStation() {
        return toStation;
    }

    public void setToStation(String toStation) {
        this.toStation = toStation;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
