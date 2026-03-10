package com.kidsbank.api.user;

import com.kidsbank.api.common.ApiResponse;
import com.kidsbank.api.common.BadRequestException;
import com.kidsbank.api.security.JwtService;
import com.kidsbank.api.security.RefreshToken;
import com.kidsbank.api.security.RefreshTokenService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.web.bind.annotation.*;

import static com.kidsbank.api.user.AuthDtos.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
  private final UserService userService;
  private final JwtService jwtService;
  private final RefreshTokenService refreshTokenService;

  public AuthController(UserService userService, JwtService jwtService, RefreshTokenService refreshTokenService) {
    this.userService = userService;
    this.jwtService = jwtService;
    this.refreshTokenService = refreshTokenService;
  }

  @PostMapping("/register")
  public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
    User u = userService.createUser(req.username(), req.password(), req.role());
    String accessToken = jwtService.generateAccessToken(u.getId(), u.getUsername(), u.getRole());
    
    RefreshToken refreshToken = null;
    if (req.rememberMe()) {
      refreshToken = refreshTokenService.createRefreshToken(u);
    }
    
    UserDto userDto = new UserDto(u.getId(), u.getUsername(), u.getRole());
    AuthResponse response = new AuthResponse(
      accessToken, 
      refreshToken != null ? refreshToken.getToken() : null,
      userDto
    );
    
    return ApiResponse.ok("User registered successfully", response);
  }

  @PostMapping("/login")
  public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
    User u = userService.findByUsername(req.username());
    if (!userService.matches(u, req.password())) {
      throw new BadRequestException("Invalid username or password");
    }
    
    if (!u.isEnabled()) {
      throw new BadRequestException("Account is disabled");
    }
    
    String accessToken = jwtService.generateAccessToken(u.getId(), u.getUsername(), u.getRole());
    
    RefreshToken refreshToken = null;
    if (req.rememberMe()) {
      refreshToken = refreshTokenService.createRefreshToken(u);
    }
    
    UserDto userDto = new UserDto(u.getId(), u.getUsername(), u.getRole());
    AuthResponse response = new AuthResponse(
      accessToken, 
      refreshToken != null ? refreshToken.getToken() : null,
      userDto
    );
    
    return ApiResponse.ok("Login successful", response);
  }

  @PostMapping("/refresh")
  public ApiResponse<RefreshResponse> refresh(@Valid @RequestBody RefreshRequest req) {
    String newAccessToken = refreshTokenService.refreshAccessToken(req.refreshToken());
    RefreshResponse response = new RefreshResponse(newAccessToken);
    return ApiResponse.ok("Token refreshed", response);
  }

  @PostMapping("/logout")
  public ApiResponse<Void> logout(@Valid @RequestBody LogoutRequest req) {
    if (req.refreshToken() != null) {
      refreshTokenService.revokeRefreshToken(req.refreshToken());
    }
    return ApiResponse.ok("Logged out successfully", null);
  }

  // Additional DTOs
  public record RefreshRequest(@NotBlank String refreshToken) {}
  public record RefreshResponse(String accessToken) {}
  public record LogoutRequest(String refreshToken) {}
}