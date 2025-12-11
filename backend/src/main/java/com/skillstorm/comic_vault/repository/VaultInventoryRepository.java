package com.skillstorm.comic_vault.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.skillstorm.comic_vault.model.VaultInventory;

@Repository
public interface VaultInventoryRepository extends JpaRepository<VaultInventory, Long> {
    // Spring Data JPA will automatically implement these methods based on their names
    
    // find all inventory records for a specific vault
    List<VaultInventory> findByVaultId(Long vaultId);

    // find a specific inventory record (vault + comic combo)
    Optional<VaultInventory> findByVaultIdAndComicId(Long vaultId, Long comicId);
    
    // check if a comic exists in any vault
    boolean existsByComicId(Long comicId);

    // check if a vault has any inventory
    boolean existsByVaultId(Long vaultId);
}
