package com.kidsbank.api.admin;

import com.kidsbank.api.bank.Transaction;
import com.kidsbank.api.common.ApiResponse;
import com.kidsbank.api.family.Family;
import com.kidsbank.api.game.Game;
import com.kidsbank.api.user.Role;
import com.kidsbank.api.user.User;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

  private final AdminService adminService;

  public AdminController(AdminService adminService) {
    this.adminService = adminService;
  }

  // User Management
  @GetMapping("/users")
  public ApiResponse<List<User>> getAllUsers() {
    return ApiResponse.ok("Users retrieved", adminService.getAllUsers());
  }

  @PutMapping("/users/{id}")
  public ApiResponse<User> updateUser(
      @PathVariable Long id,
      @RequestBody @Valid UpdateUserRequest req) {
    User user = adminService.updateUser(id, req.username(), req.role(), req.enabled());
    return ApiResponse.ok("User updated", user);
  }

  @PutMapping("/users/{id}/enable")
  public ApiResponse<User> enableUser(@PathVariable Long id) {
    User user = adminService.updateUser(id, null, null, true);
    return ApiResponse.ok("User enabled", user);
  }

  @PutMapping("/users/{id}/disable")
  public ApiResponse<User> disableUser(@PathVariable Long id) {
    User user = adminService.updateUser(id, null, null, false);
    return ApiResponse.ok("User disabled", user);
  }

  @DeleteMapping("/users/{id}")
  public ApiResponse<Void> deleteUser(@PathVariable Long id) {
    adminService.deleteUser(id);
    return ApiResponse.ok("User deleted", null);
  }

  // Game Management
  @GetMapping("/games")
  public ApiResponse<List<Game>> getAllGames() {
    return ApiResponse.ok("Games retrieved", adminService.getAllGames());
  }

  @PostMapping("/games")
  public ApiResponse<Game> createGame(@RequestBody @Valid CreateGameRequest req) {
    Game game = adminService.createGame(req.code(), req.title(), req.description(), req.rewardCoins());
    return ApiResponse.ok("Game created", game);
  }

  @PutMapping("/games/{id}")
  public ApiResponse<Game> updateGame(
      @PathVariable Long id,
      @RequestBody @Valid UpdateGameRequest req) {
    Game game = adminService.updateGame(id, req.title(), req.description(), req.rewardCoins());
    return ApiResponse.ok("Game updated", game);
  }

  @DeleteMapping("/games/{id}")
  public ApiResponse<Void> deleteGame(@PathVariable Long id) {
    adminService.deleteGame(id);
    return ApiResponse.ok("Game deleted", null);
  }

  // Transaction Management
  @GetMapping("/transactions")
  public ApiResponse<List<Transaction>> getAllTransactions() {
    return ApiResponse.ok("Transactions retrieved", adminService.getAllTransactions());
  }

  // Family Management
  @GetMapping("/families")
  public ApiResponse<List<Family>> getAllFamilies() {
    return ApiResponse.ok("Families retrieved", adminService.getAllFamilies());
  }

  // Statistics
  @GetMapping("/stats")
  public ApiResponse<Map<String, Object>> getStats() {
    return ApiResponse.ok("Statistics retrieved", adminService.getSystemStats());
  }

  // DTOs
  public record UpdateUserRequest(String username, Role role, Boolean enabled) {}
  public record CreateGameRequest(
      @NotBlank String code,
      @NotBlank String title,
      String description,
      @NotNull Integer rewardCoins) {}
  public record UpdateGameRequest(String title, String description, Integer rewardCoins) {}
}
