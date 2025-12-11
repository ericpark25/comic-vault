package com.skillstorm.comic_vault.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

// DTO for updating the quantity of an existing comic in a vault
public class UpdateQuantityRequest {

    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity must be at least 0")
    private Integer quantity;

    // Default constructor
    public UpdateQuantityRequest() {
    }

    // Constructor with field
    public UpdateQuantityRequest(Integer quantity) {
        this.quantity = quantity;
    }

    // Getters and Setters
    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}