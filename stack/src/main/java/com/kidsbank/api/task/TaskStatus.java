package com.kidsbank.api.task;

public enum TaskStatus {
    PENDING,    // Created by parent, waiting for child
    IN_PROGRESS, // Child has started working on it
    COMPLETED,  // Child completed and uploaded photo
    APPROVED,   // Parent approved, payment released
    REJECTED    // Parent rejected, needs to be redone
}