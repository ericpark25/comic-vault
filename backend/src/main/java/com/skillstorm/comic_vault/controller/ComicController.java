package com.skillstorm.comic_vault.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skillstorm.comic_vault.model.Comic;
import com.skillstorm.comic_vault.service.ComicService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/comics")      // base URL path for comics
public class ComicController {
    
    private final ComicService comicService;

    public ComicController(ComicService comicService) {
        this.comicService = comicService;
    }

    // GET /api/comics - get all comics
    @GetMapping
    public ResponseEntity<List<Comic>> getAllComics() {
        List<Comic> comics = comicService.getAllComics();
        return ResponseEntity.ok(comics);
    }

    // GET /api/comics/{id} - get comic by ID
    @GetMapping("/{id}")
    public ResponseEntity<Comic> getComicById(@PathVariable Long id) {
        return comicService.getComicById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // POST /api/comics - create new comic
    @PostMapping
    public ResponseEntity<Comic> createComic(@Valid @RequestBody Comic comic) {
        Comic createdComic = comicService.createComic(comic);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdComic);
    }

    // PUT /api/comics/{id} - update comic
    @PutMapping("/{id}")
    public ResponseEntity<Comic> updateComic(@PathVariable Long id, @Valid @RequestBody Comic comicDetails) {
        Comic updatedComic = comicService.updateComic(id, comicDetails);
        return ResponseEntity.ok(updatedComic);
    }

    // DELETE /api/comics/{id} - delete comic
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComic(@PathVariable Long id) {
        comicService.deleteComic(id);
        return ResponseEntity.noContent().build();
    }
}
