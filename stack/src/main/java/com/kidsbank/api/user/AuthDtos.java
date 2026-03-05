package com.kidsbank.api.user;

import jakarta.validation.constraints.*;

public class AuthDtos {
  public record RegisterRequest(
      @NotBlank @Size(min=3, max=50) String username,
      @NotBlank @Size(min=6, max=100) String password,
      @NotNull Role role
  ) {}

  public record LoginRequest(@NotBlank String username, @NotBlank String password) {}

  public record UserDto(Long id, String username, Role role) {}
  
  public record AuthResponse(String token, UserDto user) {}
}