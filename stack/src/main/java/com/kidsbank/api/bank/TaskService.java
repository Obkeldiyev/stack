package com.kidsbank.api.bank;

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
public class TaskService {

  private final TaskRepository repo;
  private final UserService userService;
  private final AccountRepository accountRepo;
  private final TransactionRepository txRepo;

  public TaskService(TaskRepository repo, UserService userService,
                     AccountRepository accountRepo, TransactionRepository txRepo) {
    this.repo = repo;
    this.userService = userService;
    this.accountRepo = accountRepo;
    this.txRepo = txRepo;
  }

  public List<TaskItem> parentTasks(Long parentId) {
    return repo.findAllByParent_IdOrderByCreatedAtDesc(parentId);
  }

  public List<TaskItem> childTasks(Long childId) {
    return repo.findAllByChild_IdOrderByCreatedAtDesc(childId);
  }

  @Transactional
  public TaskItem create(Long parentId, Long childId, String title, String description, long rewardAmount) {
    User parent = userService.findById(parentId);
    User child = userService.findById(childId);

    if (parent.getRole() != Role.PARENT) throw new BadRequestException("Only PARENT can create tasks");
    if (child.getRole() != Role.CHILD) throw new BadRequestException("Task must be assigned to CHILD");
    if (rewardAmount <= 0) throw new BadRequestException("Reward must be > 0");

    TaskItem t = new TaskItem();
    t.setParent(parent);
    t.setChild(child);
    t.setTitle(title);
    t.setDescription(description);
    t.setRewardAmount(rewardAmount);
    t.setStatus(TaskStatus.CREATED);
    return repo.save(t);
  }

  @Transactional
  public TaskItem childMarkCompleted(Long childId, Long taskId) {
    TaskItem t = repo.findByIdAndChild_Id(taskId, childId)
        .orElseThrow(() -> new NotFoundException("Task not found"));
    if (t.getStatus() != TaskStatus.CREATED) {
      throw new BadRequestException("Task is not in CREATED state");
    }
    t.setStatus(TaskStatus.COMPLETED_BY_CHILD);
    t.setCompletedAt(Instant.now());
    return repo.save(t);
  }

  @Transactional
  public TaskItem parentApproveAndPay(Long parentId, Long taskId, Long childAccountId) {
    TaskItem t = repo.findByIdAndParent_Id(taskId, parentId)
        .orElseThrow(() -> new NotFoundException("Task not found"));

    if (t.getStatus() != TaskStatus.COMPLETED_BY_CHILD) {
      throw new BadRequestException("Task must be completed by child first");
    }

    // ensure account belongs to that child
    Account a = accountRepo.findByIdAndOwner_Id(childAccountId, t.getChild().getId())
        .orElseThrow(() -> new BadRequestException("Account does not belong to task child"));

    a.setBalance(a.getBalance() + t.getRewardAmount());
    accountRepo.save(a);

    Transaction tx = new Transaction();
    tx.setAccount(a);
    tx.setType(TransactionType.TASK_REWARD);
    tx.setAmount(t.getRewardAmount());
    tx.setNote("Task reward: " + t.getTitle());
    txRepo.save(tx);

    t.setStatus(TaskStatus.APPROVED_AND_PAID);
    return repo.save(t);
  }

  @Transactional
  public TaskItem parentReject(Long parentId, Long taskId, String reason) {
    TaskItem t = repo.findByIdAndParent_Id(taskId, parentId)
        .orElseThrow(() -> new NotFoundException("Task not found"));
    if (t.getStatus() != TaskStatus.COMPLETED_BY_CHILD) {
      throw new BadRequestException("Task must be completed by child first");
    }
    t.setStatus(TaskStatus.REJECTED);
    if (reason != null && !reason.isBlank()) {
      t.setDescription((t.getDescription() == null ? "" : t.getDescription() + " | ") + "Rejected: " + reason);
    }
    return repo.save(t);
  }
}