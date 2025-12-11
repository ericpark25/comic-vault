package com.skillstorm.comic_vault.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/**
 * DTO used to request a transfer of comics between vaults
 * 
 * represents the payload coming from the frontend
 */
public class TransferRequest {

    @NotNull(message = "Source vault ID is required")
    private Long sourceVaultId;

    @NotNull(message = "Destination vault ID is required")
    private Long destinationVaultId;

    @NotNull(message = "Comic ID is required")
    private Long comicId;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    // default constructor
    public TransferRequest() {
    }

    // full constructor
    public TransferRequest(Long sourceVaultId, Long destinationVaultId, Long comicId, Integer quantity) {
        this.sourceVaultId = sourceVaultId;
        this.destinationVaultId = destinationVaultId;
        this.comicId = comicId;
        this.quantity = quantity;
    }

    // getters and setters
    public Long getSourceVaultId() {
        return sourceVaultId;
    }

    public void setSourceVaultId(Long sourceVaultId) {
        this.sourceVaultId = sourceVaultId;
    }

    public Long getDestinationVaultId() {
        return destinationVaultId;
    }

    public void setDestinationVaultId(Long destinationVaultId) {
        this.destinationVaultId = destinationVaultId;
    }

    public Long getComicId() {
        return comicId;
    }

    public void setComicId(Long comicId) {
        this.comicId = comicId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}