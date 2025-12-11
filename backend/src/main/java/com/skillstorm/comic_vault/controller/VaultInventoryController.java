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

import com.skillstorm.comic_vault.dto.AddComicRequest;
import com.skillstorm.comic_vault.dto.UpdateQuantityRequest;
import com.skillstorm.comic_vault.model.VaultInventory;
import com.skillstorm.comic_vault.service.VaultInventoryService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/vaults/{vaultId}/inventory")
public class VaultInventoryController {
    
    private final VaultInventoryService vaultInventoryService; 

    public VaultInventoryController(VaultInventoryService vaultInventoryService) {
        this.vaultInventoryService = vaultInventoryService;
    }

    // GET /api/vaults/{vaultId}/inventory - get all inventory records for a vault
    @GetMapping
    public ResponseEntity<List<VaultInventory>> getVaultInventory(@PathVariable Long vaultId) {
        List<VaultInventory> inventory = vaultInventoryService.getVaultInventory(vaultId);
        return ResponseEntity.ok(inventory);
    }

    // GET /api/vaults/{vaultId}/inventory/{comicId} - Get specific inventory item
    @GetMapping("/{comicId}")
    public ResponseEntity<VaultInventory> getInventoryItem(@PathVariable Long vaultId, @PathVariable Long comicId) {
        return vaultInventoryService.getInventoryItem(vaultId, comicId).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // POST /api/vaults/{vaultId}/inventory - add comic to vault
    @PostMapping
    public ResponseEntity<VaultInventory> addComicToVault(@PathVariable Long vaultId, @Valid @RequestBody AddComicRequest request) {
        VaultInventory inventory = vaultInventoryService.addComicToVault(vaultId, request.getComicId(), request.getQuantity());
        return ResponseEntity.status(HttpStatus.CREATED).body(inventory);
    }

    // PUT /api/vaults/{vaultId}/inventory/{comicId} - update quantity
    @PutMapping("/{comicId}")
    public ResponseEntity<VaultInventory> updateQuantity(@PathVariable Long vaultId, @PathVariable Long comicId, @Valid @RequestBody UpdateQuantityRequest request) {
        VaultInventory inventory = vaultInventoryService.updateQuantity(vaultId, comicId, request.getQuantity());
        return ResponseEntity.ok(inventory);
    }

    // DELETE /api/vaults/{vaultId}/inventory/{comicId} - remove comic from vault
    @DeleteMapping("/{comicId}")
    public ResponseEntity<Void> removeFromVault(@PathVariable Long vaultId, @PathVariable Long comicId) {
        vaultInventoryService.removeFromVault(vaultId, comicId);
        return ResponseEntity.noContent().build();
    }
}
