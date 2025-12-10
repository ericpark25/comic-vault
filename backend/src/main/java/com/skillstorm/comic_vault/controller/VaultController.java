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

import com.skillstorm.comic_vault.model.Vault;
import com.skillstorm.comic_vault.service.VaultService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/vaults")      // base URL path for all Vault-related endpoints
public class VaultController {
    
    private final VaultService vaultService;

    // constructor injection for VaultService bean
    public VaultController(VaultService vaultService) {
        this.vaultService = vaultService;
    }

    // GET /api/vaults - get all vaults
    @GetMapping
    public ResponseEntity<List<Vault>> getAllValues() {
        List<Vault> vaults = vaultService.getAllVaults();
        return ResponseEntity.ok(vaults);
    }

    // GET /api/vaults/{id} - get vault by ID
    @GetMapping("/{id}")
    public ResponseEntity<Vault> getVaultById(@PathVariable Long id) {
        // map transforms Optional<Vault> -> Optional<ResponseEntity<Vault>>
        // using method reference
        // essentially the same as map(vault -> ResponseEntity.ok(vault))
        return vaultService.getVaultById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // POST /api/vaults
    @PostMapping
    public ResponseEntity<Vault> createVault(@Valid @RequestBody Vault vault) {
        // @Valid tells Spring to validate the request body against the validation annotations in the entity model
        Vault createdVault = vaultService.createVault(vault);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdVault);
    }

    // PUT /api/vaults/{id} - Update vault
    @PutMapping("/{id}")
    public ResponseEntity<Vault> updateVault(@PathVariable Long id, @Valid @RequestBody Vault vaultDetails) {
        // wrap try/catch because vaultService.updateVault() may throw an exception
        try {
            Vault updatedVault = vaultService.updateVault(id, vaultDetails);
            return ResponseEntity.ok(updatedVault);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE /api/vaults/{id} - Delete vault
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVault(@PathVariable Long id) {
        try {
            vaultService.deleteVault(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
