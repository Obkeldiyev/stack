package com.kidsbank.api.admin;

import com.kidsbank.api.bank.Transaction;
import com.kidsbank.api.bank.TransactionRepository;
import com.kidsbank.api.common.BadRequestException;
import com.kidsbank.api.common.NotFoundException;
import com.kidsbank.api.family.Family;
import com.kidsbank.api.family.FamilyMemberRepository;
import com.kidsbank.api.family.FamilyRepository;
import com.kidsbank.api.game.Game;
import com.kidsbank.api.game.GameRepository;
import com.kidsbank.api.user.Role;
import com.kidsbank.api.user.User;
import com.kidsbank.api.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

  private final UserRepository userRepo;
  private final GameRepository gameRepo;
  private final TransactionRepository transactionRepo;
  private final FamilyRepository familyRepo;
  private final FamilyMemberRepository familyMemberRepo;

  public AdminService(UserRepository userRepo, GameRepository gameRepo,
                      TransactionRepository transactionRepo, FamilyRepository familyRepo,
                      FamilyMemberRepository familyMemberRepo) {
    this.userRepo = userRepo;
    this.gameRepo = gameRepo;
    this.transactionRepo = transactionRepo;
    this.familyRepo = familyRepo;
    this.familyMemberRepo = familyMemberRepo;
  }

  // User Management
  public List<User> getAllUsers() {
    return userRepo.findAll();
  }

  @Transactional
  public User updateUser(Long userId, String username, Role role, Boolean enabled) {
    User user = userRepo.findById(userId)
        .orElseThrow(() -> new NotFoundException("User not found"));
    
    if (username != null && !username.isBlank()) {
      user.setUsername(username);
    }
    if (role != null) {
      user.setRole(role);
    }
    if (enabled != null) {
      user.setEnabled(enabled);
    }
    
    return userRepo.save(user);
  }

  @Transactional
  public void deleteUser(Long userId) {
    User user = userRepo.findById(userId)
        .orElseThrow(() -> new NotFoundException("User not found"));
    
    if (user.getRole() == Role.ADMIN) {
      throw new BadRequestException("Cannot delete admin user");
    }
    
    userRepo.delete(user);
  }

  // Game Management
  public List<Game> getAllGames() {
    return gameRepo.findAll();
  }

  @Transactional
  public Game createGame(String code, String title, String description, int rewardCoins) {
    if (gameRepo.findByCode(code).isPresent()) {
      throw new BadRequestException("Game with code " + code + " already exists");
    }
    
    Game game = new Game();
    game.setCode(code);
    game.setTitle(title);
    game.setDescription(description);
    game.setRewardCoins(rewardCoins);
    
    return gameRepo.save(game);
  }

  @Transactional
  public Game updateGame(Long gameId, String title, String description, Integer rewardCoins) {
    Game game = gameRepo.findById(gameId)
        .orElseThrow(() -> new NotFoundException("Game not found"));
    
    if (title != null && !title.isBlank()) {
      game.setTitle(title);
    }
    if (description != null) {
      game.setDescription(description);
    }
    if (rewardCoins != null) {
      game.setRewardCoins(rewardCoins);
    }
    
    return gameRepo.save(game);
  }

  @Transactional
  public void deleteGame(Long gameId) {
    Game game = gameRepo.findById(gameId)
        .orElseThrow(() -> new NotFoundException("Game not found"));
    gameRepo.delete(game);
  }

  // Transaction Management
  public List<Transaction> getAllTransactions() {
    return transactionRepo.findAll();
  }

  // Family Management
  public List<Family> getAllFamilies() {
    return familyRepo.findAll();
  }

  // Statistics
  public Map<String, Object> getSystemStats() {
    Map<String, Object> stats = new HashMap<>();
    
    stats.put("totalUsers", userRepo.count());
    stats.put("totalParents", userRepo.countByRole(Role.PARENT));
    stats.put("totalChildren", userRepo.countByRole(Role.CHILD));
    stats.put("totalFamilies", familyRepo.count());
    stats.put("totalGames", gameRepo.count());
    stats.put("totalTransactions", transactionRepo.count());
    
    return stats;
  }
}
