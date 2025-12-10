package com.skillstorm.comic_vault.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.skillstorm.comic_vault.model.Vault;

@Repository
public interface VaultRepository extends JpaRepository<Vault, Long>{
    // no need for implementations; JPA gives us built in functions OOTB
}
