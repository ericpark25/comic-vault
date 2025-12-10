package com.skillstorm.comic_vault.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.skillstorm.comic_vault.model.Vault;
import com.skillstorm.comic_vault.repository.VaultRepository;

@Service
public class VaultService {
    
    private final VaultRepository vaultRepository;

    // constructor injection for VaultRepository bean
    public VaultService(VaultRepository vaultRepository) {
        this.vaultRepository = vaultRepository;
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
        Vault vault = vaultRepository.findById(id).orElseThrow(() -> new RuntimeException("Vault not found with id: " + id));

        // update vault object with new vaultDetails
        vault.setName(vaultDetails.getName());
        vault.setLocation(vaultDetails.getLocation());
        vault.setMaxCapacity(vaultDetails.getMaxCapacity());

        return vaultRepository.save(vault);
    }

    // delete existing vault
    public void deleteVault(Long id) {
        // unwraps the Optional to a Vault if found; otherwise throws exception
        Vault vault = vaultRepository.findById(id).orElseThrow(() -> new RuntimeException("Vault not found with id: " + id));

        vaultRepository.delete(vault);
    }

}
