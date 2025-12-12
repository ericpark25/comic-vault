package com.skillstorm.comic_vault.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.skillstorm.comic_vault.exception.InvalidOperationException;
import com.skillstorm.comic_vault.exception.ResourceNotFoundException;
import com.skillstorm.comic_vault.model.Comic;
import com.skillstorm.comic_vault.repository.ComicRepository;

@Service
public class ComicService {
    
    private final ComicRepository comicRepository;
    private final VaultInventoryService inventoryService;
    
    // constructor injection
    public ComicService(ComicRepository comicRepository, VaultInventoryService inventoryService) {
        this.comicRepository = comicRepository;
        this.inventoryService = inventoryService;
    }
    
    // get all comics
    public List<Comic> getAllComics() {
        return comicRepository.findAll();
    }
    
    // get comic by ID
    public Optional<Comic> getComicById(Long id) {
        return comicRepository.findById(id);
    }
    
    // create new comic
    public Comic createComic(Comic comic) {
        return comicRepository.save(comic);
    }
    
    // update existing comic
    public Comic updateComic(Long id, Comic comicDetails) {
        Comic comic = comicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comic not found with id: " + id));

        comic.setSku(comicDetails.getSku());
        comic.setName(comicDetails.getName());
        comic.setDescription(comicDetails.getDescription());
        comic.setPrice(comicDetails.getPrice());

        return comicRepository.save(comic);
    }
    
    // delete comic
    public void deleteComic(Long id) {
        Comic comic = comicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comic not found with id: " + id));

        if (inventoryService.comicExistsInVaults(id)) {
            throw new InvalidOperationException("Cannot delete comic that exists in vaults. Please remove from all vaults first.");
        }

        comicRepository.delete(comic);
    }
}
