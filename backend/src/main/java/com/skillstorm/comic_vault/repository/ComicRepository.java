package com.skillstorm.comic_vault.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.skillstorm.comic_vault.model.Comic;

@Repository
public interface ComicRepository extends JpaRepository<Comic, Long> {
    // JpaRepository gives us CRUD methods OOTB

    // find comic by SKU
    Optional<Comic> findBySku(String sku);

    // check if SKU exists
    boolean existsBySku(String sku);
}
