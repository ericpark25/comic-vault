package com.skillstorm.comic_vault.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.skillstorm.comic_vault.exception.InvalidOperationException;
import com.skillstorm.comic_vault.exception.ResourceNotFoundException;
import com.skillstorm.comic_vault.model.Vault;
import com.skillstorm.comic_vault.repository.VaultRepository;

@Service
public class VaultService {
    
    private final VaultRepository vaultRepository;
    private final VaultInventoryService inventoryService;

    // constructor injection for VaultRepository bean
    public VaultService(VaultRepository vaultRepository, VaultInventoryService inventoryService) {
        this.vaultRepository = vaultRepository;
        this.inventoryService = inventoryService;
    }

    // get all vaults
    public List<Vault> getAllVaults() {
        return vaultRepository.findAll();
    }

    // get vault by ID - returns Optional -> handled by Controller
    public Optional<Vault> getVaultById(Long id) {
        return vaultRepository.findById(id);
    }

    // create new vault
    public Vault createVault(Vault vault) {
        return vaultRepository.save(vault);
    }

    // update existing vault
    public Vault updateVault(Long id, Vault vaultDetails) {
        // unwraps the Optional to a Vault if found; otherwise throws exception
        Vault vault = vaultRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Vault not found with id: " + id));

        // validate that new max capacity is not less than current inventory total
        int currentTotal = inventoryService.getCurrentVaultTotal(id);
        if (vaultDetails.getMaxCapacity() < currentTotal) {
            throw new InvalidOperationException("Cannot set max capacity to " + vaultDetails.getMaxCapacity() +
                ". Vault currently contains " + currentTotal + " comics.");
        }

        // update vault object with new vaultDetails
        vault.setName(vaultDetails.getName());
        vault.setLocation(vaultDetails.getLocation());
        vault.setMaxCapacity(vaultDetails.getMaxCapacity());

        return vaultRepository.save(vault);
    }

    // delete existing vault
    public void deleteVault(Long id) {
        // unwraps the Optional to a Vault if found; otherwise throws exception
        Vault vault = vaultRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Vault not found with id: " + id));

        // check if vault has an existing inventory
        if (inventoryService.vaultHasInventory(id)) {
            throw new InvalidOperationException("Cannot delete vault with existing inventory. Please empty the vault first.");
        }

        vaultRepository.delete(vault);
    }

}
