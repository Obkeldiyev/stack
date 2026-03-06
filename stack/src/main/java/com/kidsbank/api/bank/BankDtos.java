package com.kidsbank.api.bank;

import java.time.Instant;
import java.util.List;

public class BankDtos {

  public record AccountDto(
      Long id,
      String ownerUsername,
      Long ownerId,
      AccountType type,
      long balance,
      double balanceFormatted,
      Instant createdAt
  ) {
    public static AccountDto from(Account account) {
      return new AccountDto(
          account.getId(),
          account.getOwner().getUsername(),
          account.getOwner().getId(),
          account.getType(),
          account.getBalance(),
          account.getBalance() / 100.0,
          account.getCreatedAt()
      );
    }
  }

  public record TransactionDto(
      Long id,
      TransactionType type,
      long amount,
      double amountFormatted,
      String note,
      Instant createdAt
  ) {
    public static TransactionDto from(Transaction tx) {
      return new TransactionDto(
          tx.getId(),
          tx.getType(),
          tx.getAmount(),
          tx.getAmount() / 100.0,
          tx.getNote(),
          tx.getCreatedAt()
      );
    }
  }

  public record GoalDto(
      Long id,
      String title,
      long targetAmount,
      long savedAmount,
      double targetFormatted,
      double savedFormatted,
      int progressPercent,
      boolean completed,
      Instant createdAt
  ) {
    public static GoalDto from(Goal goal) {
      int progress = goal.getTargetAmount() > 0 
          ? (int) ((goal.getSavedAmount() * 100) / goal.getTargetAmount())
          : 0;
      return new GoalDto(
          goal.getId(),
          goal.getTitle(),
          goal.getTargetAmount(),
          goal.getSavedAmount(),
          goal.getTargetAmount() / 100.0,
          goal.getSavedAmount() / 100.0,
          Math.min(progress, 100),
          goal.isCompleted(),
          goal.getCreatedAt()
      );
    }
  }

  public record ChildDashboard(
      AccountDto currentAccount,
      List<AccountDto> allAccounts,
      List<TransactionDto> recentTransactions,
      List<GoalDto> activeGoals,
      DashboardStats stats
  ) {}

  public record ParentDashboard(
      List<FamilyAccountSummary> families,
      DashboardStats totalStats
  ) {}

  public record FamilyAccountSummary(
      Long familyId,
      String familyTitle,
      List<ChildAccountSummary> children,
      long totalBalance,
      double totalBalanceFormatted
  ) {}

  public record ChildAccountSummary(
      Long childId,
      String childUsername,
      List<AccountDto> accounts,
      long totalBalance,
      double totalBalanceFormatted,
      int activeGoals,
      int completedTasks
  ) {}

  public record DashboardStats(
      long totalBalance,
      double totalBalanceFormatted,
      int totalTransactions,
      int activeGoals,
      int completedGoals
  ) {}
}
