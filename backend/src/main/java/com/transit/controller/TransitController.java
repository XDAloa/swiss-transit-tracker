package com.transit.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.transit.model.FavoriteRoute;
import com.transit.service.TransitService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
public class TransitController {

    private final TransitService transitService;

    public TransitController(TransitService transitService) {
        this.transitService = transitService;
    }

    @GetMapping({"/locations", "/stations"})
    public JsonNode locations(@RequestParam(name = "query", required = false) String query) {
        return transitService.getLocations(query);
    }

    @GetMapping("/connections")
    public JsonNode connections(
            @RequestParam(name = "from") String from,
            @RequestParam(name = "to") String to,
            @RequestParam(name = "date", required = false) LocalDate date) {
        return transitService.getConnections(from, to, date);
    }

    @GetMapping("/favorites")
    public List<FavoriteRoute> favorites() {
        return transitService.getFavorites();
    }

    @GetMapping("/favorites/{id}")
    public FavoriteRoute favorite(@PathVariable String id) {
        return transitService.getFavorite(id);
    }

    @PostMapping("/favorites")
    public ResponseEntity<FavoriteRoute> create(@Valid @RequestBody FavoriteRoute favorite) {
        return ResponseEntity.status(HttpStatus.CREATED).body(transitService.createFavorite(favorite));
    }

    @PutMapping("/favorites/{id}")
    public FavoriteRoute update(@PathVariable String id, @Valid @RequestBody FavoriteRoute favorite) {
        return transitService.updateFavorite(id, favorite);
    }

    @DeleteMapping("/favorites/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        transitService.deleteFavorite(id);
    }
}
