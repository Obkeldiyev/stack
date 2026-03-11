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

import static com.kidsbank.api.admin.AdminDtos.*;

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
  public List<AdminUserDto> getAllUsers() {
    return userRepo.findAll().stream()
        .map(AdminUserDto::from)
        .toList();
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
  public List<AdminGameDto> getAllGames() {
    return gameRepo.findAll().stream()
        .map(AdminGameDto::from)
        .toList();
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
    game.setCoinsPer100Points(rewardCoins);
    
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
      game.setCoinsPer100Points(rewardCoins);
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
  public List<AdminTransactionDto> getAllTransactions() {
    return transactionRepo.findAll().stream()
        .map(AdminTransactionDto::from)
        .toList();
  }

  // Family Management
  public List<AdminFamilyDto> getAllFamilies() {
    return familyRepo.findAll().stream()
        .map(family -> AdminFamilyDto.from(family, familyMemberRepo.findAllByFamily_Id(family.getId())))
        .toList();
  }

  // Statistics
  public AdminStatsDto getSystemStats() {
    long totalUsers = userRepo.count();
    long totalParents = userRepo.countByRole(Role.PARENT);
    long totalChildren = userRepo.countByRole(Role.CHILD);
    long totalAdmins = userRepo.countByRole(Role.ADMIN);
    long totalFamilies = familyRepo.count();
    long totalGames = gameRepo.count();
    long totalTransactions = transactionRepo.count();

    Map<String, Long> usersByRole = new HashMap<>();
    usersByRole.put(Role.PARENT.name(), totalParents);
    usersByRole.put(Role.CHILD.name(), totalChildren);
    usersByRole.put(Role.ADMIN.name(), totalAdmins);

    return new AdminStatsDto(
        totalUsers,
        totalParents,
        totalChildren,
        totalAdmins,
        totalFamilies,
        totalGames,
        totalTransactions,
        usersByRole
    );
  }
}
