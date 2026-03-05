package com.kidsbank.api.bank;

import com.kidsbank.api.common.BadRequestException;
import com.kidsbank.api.common.NotFoundException;
import com.kidsbank.api.user.Role;
import com.kidsbank.api.user.User;
import com.kidsbank.api.user.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class GoalService {

  private final GoalRepository repo;
  private final UserService userService;
  private final AccountRepository accountRepo;
  private final TransactionRepository txRepo;

  public GoalService(GoalRepository repo, UserService userService,
                     AccountRepository accountRepo, TransactionRepository txRepo) {
    this.repo = repo;
    this.userService = userService;
    this.accountRepo = accountRepo;
    this.txRepo = txRepo;
  }

  public List<Goal> myGoals(Long childId) {
    return repo.findAllByChild_IdOrderByCreatedAtDesc(childId);
  }

  @Transactional
  public Goal create(Long childId, String title, long targetAmount) {
    User child = userService.findById(childId);
    if (child.getRole() != Role.CHILD) throw new BadRequestException("Only CHILD can create goals");
    if (targetAmount <= 0) throw new BadRequestException("Target must be > 0");

    Goal g = new Goal();
    g.setChild(child);
    g.setTitle(title);
    g.setTargetAmount(targetAmount);
    g.setSavedAmount(0);
    g.setCompleted(false);
    return repo.save(g);
  }

  @Transactional
  public Goal saveToGoal(Long childId, Long goalId, Long fromAccountId, long amount) {
    if (amount <= 0) throw new BadRequestException("Amount must be > 0");

    Goal g = repo.findByIdAndChild_Id(goalId, childId)
        .orElseThrow(() -> new NotFoundException("Goal not found"));
    if (g.isCompleted()) throw new BadRequestException("Goal already completed");

    Account a = accountRepo.findByIdAndOwner_Id(fromAccountId, childId)
        .orElseThrow(() -> new BadRequestException("Account not found"));
    if (a.getBalance() < amount) throw new BadRequestException("Insufficient balance");

    a.setBalance(a.getBalance() - amount);
    accountRepo.save(a);

    g.setSavedAmount(g.getSavedAmount() + amount);
    if (g.getSavedAmount() >= g.getTargetAmount()) {
      g.setCompleted(true);
    }
    repo.save(g);

    Transaction tx = new Transaction();
    tx.setAccount(a);
    tx.setType(TransactionType.GOAL_SAVE);
    tx.setAmount(amount);
    tx.setNote("Saved to goal: " + g.getTitle());
    txRepo.save(tx);

    return g;
  }
}