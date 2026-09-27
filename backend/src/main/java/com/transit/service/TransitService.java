package com.transit.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.transit.model.FavoriteRoute;
import com.transit.repository.FavoriteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Service
public class TransitService {

    private final RestClient transportClient;
    private final FavoriteRepository favoriteRepository;

    public TransitService(RestClient transportRestClient, FavoriteRepository favoriteRepository) {
        this.transportClient = transportRestClient;
        this.favoriteRepository = favoriteRepository;
    }

    public JsonNode getLocations(String query) {
        return transportClient.get()
                .uri(uriBuilder -> uriBuilder.path("/locations")
                        .queryParamIfPresent("query", java.util.Optional.ofNullable(blankToNull(query)))
                        .build())
                .retrieve()
                .body(JsonNode.class);
    }

    public JsonNode getConnections(String from, String to, LocalDate date) {
        if (isBlank(from) || isBlank(to)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "from and to are required");
        }
        return transportClient.get()
                .uri(uriBuilder -> {
                    var builder = uriBuilder.path("/connections")
                            .queryParam("from", from)
                            .queryParam("to", to);
                    if (date != null) {
                        builder.queryParam("date", date);
                    }
                    return builder.build();
                })
                .retrieve()
                .body(JsonNode.class);
    }

    public List<FavoriteRoute> getFavorites() {
        return favoriteRepository.findAllByOrderByCreatedAtDesc();
    }

    public FavoriteRoute getFavorite(String id) {
        return favoriteRepository.findById(id)
                .orElseThrow(() -> notFound(id));
    }

    public FavoriteRoute createFavorite(FavoriteRoute favorite) {
        favorite.setId(null);
        favorite.setCreatedAt(Instant.now());
        return favoriteRepository.save(favorite);
    }

    public FavoriteRoute updateFavorite(String id, FavoriteRoute update) {
        FavoriteRoute existing = getFavorite(id);
        existing.setFromStation(update.getFromStation());
        existing.setToStation(update.getToStation());
        return favoriteRepository.save(existing);
    }

    public void deleteFavorite(String id) {
        if (!favoriteRepository.existsById(id)) {
            throw notFound(id);
        }
        favoriteRepository.deleteById(id);
    }

    private ResponseStatusException notFound(String id) {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, "Favorite route not found: " + id);
    }

    private static String blankToNull(String value) {
        return isBlank(value) ? null : value;
    }

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
