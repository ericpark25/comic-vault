package com.skillstorm.comic_vault.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skillstorm.comic_vault.dto.TransferRequest;
import com.skillstorm.comic_vault.service.VaultInventoryService;

import jakarta.validation.Valid;

// controller for transfering inventory (aka comics) from one vault to another
@RestController
@RequestMapping("/api/inventory")
public class InventoryTransferController {

    private final VaultInventoryService vaultInventoryService;

    public InventoryTransferController(VaultInventoryService vaultInventoryService) {
        this.vaultInventoryService = vaultInventoryService;
    }

    // POST /api/inventory/transfer - transfer comic between vaults
    @PostMapping("/transfer")
    public ResponseEntity<Void> transferComic(@Valid @RequestBody TransferRequest request) {
        vaultInventoryService.transferComicBetweenVaults(
            request.getSourceVaultId(),
            request.getDestinationVaultId(),
            request.getComicId(),
            request.getQuantity()
        );
        return ResponseEntity.ok().build();
    }
}