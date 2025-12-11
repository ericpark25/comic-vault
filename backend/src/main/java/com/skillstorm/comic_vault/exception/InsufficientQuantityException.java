package com.skillstorm.comic_vault.exception;

public class InsufficientQuantityException extends RuntimeException {

    public InsufficientQuantityException(String message) {
        super(message);
    }

    public InsufficientQuantityException(String message, Throwable cause) {
        super(message, cause);
    }
}