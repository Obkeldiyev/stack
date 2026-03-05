package com.kidsbank.api.user;

import com.kidsbank.api.common.ApiResponse;
import com.kidsbank.api.common.BadRequestException;
import com.kidsbank.api.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import static com.kidsbank.api.user.AuthDtos.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
  private final UserService userService;
  private final JwtService jwtService;

  public AuthController(UserService userService, JwtService jwtService) {
    this.userService = userService;
    this.jwtService = jwtService;
  }

  @PostMapping("/register")
  public AuthResponse register(@Valid @RequestBody RegisterRequest req) {
    User u = userService.register(req.username(), req.password(), req.role());
    String token = jwtService.generateAccessToken(u.getId(), u.getUsername(), u.getRole());
    UserDto userDto = new UserDto(u.getId(), u.getUsername(), u.getRole());
    return new AuthResponse(token, userDto);
  }

  @PostMapping("/login")
  public AuthResponse login(@Valid @RequestBody LoginRequest req) {
    User u = userService.findByUsername(req.username());
    if (!userService.matches(u, req.password())) throw new BadRequestException("Invalid username or password");
    String token = jwtService.generateAccessToken(u.getId(), u.getUsername(), u.getRole());
    UserDto userDto = new UserDto(u.getId(), u.getUsername(), u.getRole());
    return new AuthResponse(token, userDto);
  }
}