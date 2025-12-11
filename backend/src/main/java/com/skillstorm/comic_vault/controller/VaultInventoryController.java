package com.skillstorm.comic_vault.controller;

import java.util.List;
import java.util.Map;

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

import com.skillstorm.comic_vault.model.VaultInventory;
import com.skillstorm.comic_vault.service.VaultInventoryService;

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
    public ResponseEntity<VaultInventory> addComicToVault(@PathVariable Long vaultId, @RequestBody Map<String, Object> request) {
        Long comicId = Long.valueOf(request.get("comicId").toString());
        Integer quantity = Integer.valueOf(request.get("quantity").toString());
        VaultInventory inventory = vaultInventoryService.addComicToVault(vaultId, comicId, quantity);
        return ResponseEntity.status(HttpStatus.CREATED).body(inventory);
    }

    // PUT /api/vaults/{vaultId}/inventory/{comicId} - update quantity
    @PutMapping("/{comicId}")
    public ResponseEntity<VaultInventory> updateQuantity(@PathVariable Long vaultId, @PathVariable Long comicId, @RequestBody Map<String, Integer> request) {
        Integer newQuantity = request.get("quantity");
        VaultInventory inventory = vaultInventoryService.updateQuantity(vaultId, comicId, newQuantity);
        return ResponseEntity.ok(inventory);
    }

    // DELETE /api/vaults/{vaultId}/inventory/{comicId} - remove comic from vault
    @DeleteMapping("/{comicId}")
    public ResponseEntity<Void> removeFromVault(@PathVariable Long vaultId, @PathVariable Long comicId) {
        vaultInventoryService.removeFromVault(vaultId, comicId);
        return ResponseEntity.noContent().build();
    }
}
