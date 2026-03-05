package com.kidsbank.api.game;

import com.kidsbank.api.bank.*;
import com.kidsbank.api.common.BadRequestException;
import com.kidsbank.api.common.NotFoundException;
import com.kidsbank.api.user.Role;
import com.kidsbank.api.user.User;
import com.kidsbank.api.user.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class GameService {

  private final GameRepository gameRepo;
  private final GameSessionRepository sessionRepo;
  private final UserService userService;

  private final AccountService accountService;
  private final AccountRepository accountRepo;
  private final TransactionRepository txRepo;

  public GameService(GameRepository gameRepo, GameSessionRepository sessionRepo,
                     UserService userService,
                     AccountService accountService, AccountRepository accountRepo,
                     TransactionRepository txRepo) {
    this.gameRepo = gameRepo;
    this.sessionRepo = sessionRepo;
    this.userService = userService;
    this.accountService = accountService;
    this.accountRepo = accountRepo;
    this.txRepo = txRepo;
  }

  // Seed games if DB empty (simple dev helper)
  @Transactional
  public void ensureGamesSeeded() {
    if (gameRepo.count() > 0) return;

    Game g1 = new Game(); g1.setCode("MATH"); g1.setTitle("Math Rush"); g1.setCoinsPer100Points(10);
    Game g2 = new Game(); g2.setCode("MEMORY"); g2.setTitle("Memory Cards"); g2.setCoinsPer100Points(8);
    Game g3 = new Game(); g3.setCode("QUIZ"); g3.setTitle("Smart Quiz"); g3.setCoinsPer100Points(12);

    gameRepo.saveAll(List.of(g1,g2,g3));
  }

  public List<Game> listGames() {
    return gameRepo.findAll();
  }

  public List<GameSession> mySessions(Long childId) {
    return sessionRepo.findAllByChild_IdOrderByStartedAtDesc(childId);
  }

  @Transactional
  public GameSession start(Long childId, Long gameId) {
    User child = userService.findById(childId);
    if (child.getRole() != Role.CHILD) throw new BadRequestException("Only CHILD can play games");

    Game game = gameRepo.findById(gameId).orElseThrow(() -> new NotFoundException("Game not found"));

    GameSession s = new GameSession();
    s.setChild(child);
    s.setGame(game);
    s.setFinished(false);
    s.setScorePoints(0);
    s.setCoinsEarned(0);
    return sessionRepo.save(s);
  }

  @Transactional
  public GameSession finish(Long childId, Long sessionId, int scorePoints) {
    if (scorePoints < 0) throw new BadRequestException("Score must be >= 0");

    GameSession s = sessionRepo.findByIdAndChild_Id(sessionId, childId)
        .orElseThrow(() -> new NotFoundException("Session not found"));

    if (s.isFinished()) throw new BadRequestException("Session already finished");

    Game game = s.getGame();
    long coins = (long) Math.floor((scorePoints / 100.0) * game.getCoinsPer100Points());
    if (coins < 0) coins = 0;

    // reward -> add to CURRENT account
    Account current = accountService.getOrCreateCurrent(childId);
    current.setBalance(current.getBalance() + coins);
    accountRepo.save(current);

    Transaction tx = new Transaction();
    tx.setAccount(current);
    tx.setType(TransactionType.GAME_REWARD);
    tx.setAmount(coins);
    tx.setNote("Game reward: " + game.getTitle() + " | score=" + scorePoints);
    txRepo.save(tx);

    s.setFinished(true);
    s.setScorePoints(scorePoints);
    s.setCoinsEarned(coins);
    s.setFinishedAt(Instant.now());
    return sessionRepo.save(s);
  }
}