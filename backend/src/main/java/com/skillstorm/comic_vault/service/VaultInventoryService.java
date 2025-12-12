package com.skillstorm.comic_vault.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.skillstorm.comic_vault.exception.InsufficientCapacityException;
import com.skillstorm.comic_vault.exception.InsufficientQuantityException;
import com.skillstorm.comic_vault.exception.InvalidOperationException;
import com.skillstorm.comic_vault.exception.ResourceNotFoundException;
import com.skillstorm.comic_vault.model.Comic;
import com.skillstorm.comic_vault.model.Vault;
import com.skillstorm.comic_vault.model.VaultInventory;
import com.skillstorm.comic_vault.repository.ComicRepository;
import com.skillstorm.comic_vault.repository.VaultInventoryRepository;
import com.skillstorm.comic_vault.repository.VaultRepository;

import jakarta.transaction.Transactional;

@Service
public class VaultInventoryService {
    
    private final VaultInventoryRepository inventoryRepository;
    private final VaultRepository vaultRepository;
    private final ComicRepository comicRepository;

    public VaultInventoryService(VaultInventoryRepository inventoryRepository, VaultRepository vaultRepository, ComicRepository comicRepository) {
        this.inventoryRepository = inventoryRepository;
        this.vaultRepository = vaultRepository;
        this.comicRepository = comicRepository;
    }

    // get all inventory for a specific vault
    public List<VaultInventory> getVaultInventory(Long vaultId) {
        // verify vault exists
        vaultRepository.findById(vaultId).orElseThrow(() -> new ResourceNotFoundException("Vault not found with id: " + vaultId));

        // return list of vault inventories that match the vault id
        return inventoryRepository.findByVaultId(vaultId);
    }

    // get a specific inventory item (vault + comic combo)
    public Optional<VaultInventory> getInventoryItem(Long vaultId, Long comicId) {
        return inventoryRepository.findByVaultIdAndComicId(vaultId, comicId);
    }

    // add comic to vault (or update quantity if it already exists)
    // @Transactional ensures that all database operations succeed or all fail together (atomicity);
    // all changes roll back upon error/failure
    @Transactional
    public VaultInventory addComicToVault(Long vaultId, Long comicId, Integer quantity) {
        // verify vault exists
        Vault vault = vaultRepository.findById(vaultId).orElseThrow(() -> new ResourceNotFoundException("Vault not found with id: " + vaultId));

        // verify comic exists
        Comic comic = comicRepository.findById(comicId).orElseThrow(() -> new ResourceNotFoundException("Comic not found with id: " + comicId));

        // check if comic already exists in this vault
        Optional<VaultInventory> existingInventory = inventoryRepository.findByVaultIdAndComicId(vaultId, comicId);

        // if comic does exist in specified vault
        if (existingInventory.isPresent()) {
            // inventory exists -> update existing quantity
            VaultInventory inventory = existingInventory.get();
            int newQuantity = inventory.getQuantity() + quantity;

            // check if vault capacity has been reached
            if (getCurrentVaultTotal(vaultId) + quantity > vault.getMaxCapacity()) {
                throw new InsufficientCapacityException("Adding " + quantity + " would exceed vault capacity. " + "Available space: " + (vault.getMaxCapacity() - getCurrentVaultTotal(vaultId)));
            }

            inventory.setQuantity(newQuantity);
            return inventoryRepository.save(inventory);
        } else {
            // inventory doesn't exist -> create new inventory record

            // check capacity
            if (getCurrentVaultTotal(vaultId) + quantity > vault.getMaxCapacity()) {
                throw new InsufficientCapacityException("Adding " + quantity + " would exceed vault capacity. " + "Available space: " + (vault.getMaxCapacity() - getCurrentVaultTotal(vaultId)));
            }

            VaultInventory newInventory = new VaultInventory(vault, comic, quantity);
            return inventoryRepository.save(newInventory);
        }
    }

    // helper function: get vault's current total quantity
    public int getCurrentVaultTotal(Long vaultId) {
        List<VaultInventory> inventories = inventoryRepository.findByVaultId(vaultId);
        int total = 0;
        for (VaultInventory inventory : inventories) {
            total += inventory.getQuantity();
        }
        return total;
    }

    // update quantity of a comic in a vault
    @Transactional
    public VaultInventory updateQuantity(Long vaultId, Long comicId, Integer newQuantity) {
        // check if inventory record exists
        VaultInventory inventory = inventoryRepository.findByVaultIdAndComicId(vaultId, comicId).orElseThrow(() -> new ResourceNotFoundException("Inventory record not found for Vault ID: " + vaultId + " and Comic ID: " + comicId));

        // get vault to check capacity
        Vault vault = vaultRepository.findById(vaultId).orElseThrow(() -> new ResourceNotFoundException("Vault not found with id: " + vaultId));

        // calculate new total of vault if quantity is changed
        int currentTotal = getCurrentVaultTotal(vaultId);
        int newTotal = currentTotal - inventory.getQuantity() + newQuantity;

        // check capacity
        if (newTotal > vault.getMaxCapacity()) {
            throw new InsufficientCapacityException("New quantity would exceed vault capacity. " +
                "Max capacity: " + vault.getMaxCapacity() +
                ", Current vault total: " + currentTotal +
                ", Current comic total: " + inventory.getQuantity());
        }

        inventory.setQuantity(newQuantity);
        return inventoryRepository.save(inventory);
    }

    // remove comic form vault
    @Transactional
    public void removeFromVault(Long vaultId, Long comicId) {
        VaultInventory inventory = inventoryRepository.findByVaultIdAndComicId(vaultId, comicId).orElseThrow(() -> new ResourceNotFoundException("Inventory record not found for Vault ID: " + vaultId + " and Comic ID: " + comicId));

        inventoryRepository.delete(inventory);
    }

    // check if vault has any inventory
    // used before deleting vault
    public boolean vaultHasInventory(Long vaultId) {
        return inventoryRepository.existsByVaultId(vaultId);
    }

    // check if comic exists in any vault
    // used before deleting comic
    public boolean comicExistsInVaults(Long comicId) {
        return inventoryRepository.existsByComicId(comicId);
    }

    // transfer comic between vaults
    @Transactional
    public void transferComicBetweenVaults(Long sourceVaultId, Long destinationVaultId, Long comicId, Integer quantity) {
        // validate that source and destination are different
        if (sourceVaultId.equals(destinationVaultId)) {
            throw new InvalidOperationException("Cannot transfer to the same vault. Source and destination must be different.");
        }

        // validate source vault exists
        Vault sourceVault = vaultRepository.findById(sourceVaultId)
                .orElseThrow(() -> new ResourceNotFoundException("Source vault not found with id: " + sourceVaultId));

        // validate destination vault exists
        Vault destinationVault = vaultRepository.findById(destinationVaultId)
                .orElseThrow(() -> new ResourceNotFoundException("Destination vault not found with id: " + destinationVaultId));

        // validate comic exists
        Comic comic = comicRepository.findById(comicId)
                .orElseThrow(() -> new ResourceNotFoundException("Comic not found with id: " + comicId));

        // validate source has the comic
        VaultInventory sourceInventory = inventoryRepository.findByVaultIdAndComicId(sourceVaultId, comicId)
                .orElseThrow(() -> new ResourceNotFoundException("Comic with id " + comicId + " not found in source vault " + sourceVaultId));

        // validate source has sufficient quantity
        if (sourceInventory.getQuantity() < quantity) {
            throw new InsufficientQuantityException("Source vault only has " + sourceInventory.getQuantity() + " comics available, cannot transfer " + quantity);
        }

        // validate destination has capacity
        int destCurrentTotal = getCurrentVaultTotal(destinationVaultId);
        int destAvailableCapacity = destinationVault.getMaxCapacity() - destCurrentTotal;
        if (destAvailableCapacity < quantity) {
            throw new InsufficientCapacityException("Destination vault only has " + destAvailableCapacity + " available capacity, cannot transfer " + quantity + " comics");
        }

        // update source inventory
        int newSourceQuantity = sourceInventory.getQuantity() - quantity;
        if (newSourceQuantity == 0) {
            // Remove the inventory record if quantity becomes 0
            inventoryRepository.delete(sourceInventory);
        } else {
            // Update the quantity
            sourceInventory.setQuantity(newSourceQuantity);
            inventoryRepository.save(sourceInventory);
        }

        // update destination inventory
        Optional<VaultInventory> destInventoryOptional = inventoryRepository.findByVaultIdAndComicId(destinationVaultId, comicId);
        if (destInventoryOptional.isPresent()) {
            // comic already exists in destination -> update quantity
            VaultInventory destInventory = destInventoryOptional.get();
            destInventory.setQuantity(destInventory.getQuantity() + quantity);
            inventoryRepository.save(destInventory);
        } else {
            // comic doesn't exist in destination -> create new record
            VaultInventory newDestInventory = new VaultInventory(destinationVault, comic, quantity);
            inventoryRepository.save(newDestInventory);
        }
    }

}
