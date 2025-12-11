package com.skillstorm.comic_vault.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

// DTO for when the frontend wants to add comics to a vault
public class AddComicRequest {

    @NotNull(message = "Comic ID is required")
    private Long comicId;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    // Default constructor
    public AddComicRequest() {
    }

    // Constructor with all fields
    public AddComicRequest(Long comicId, Integer quantity) {
        this.comicId = comicId;
        this.quantity = quantity;
    }

    // Getters and Setters
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