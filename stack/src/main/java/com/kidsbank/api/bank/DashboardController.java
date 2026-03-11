package com.kidsbank.api.bank;

import com.kidsbank.api.common.ApiResponse;
import com.kidsbank.api.family.FamilyMember;
import com.kidsbank.api.family.FamilyMemberRepository;
import com.kidsbank.api.task.TaskRepository;
import com.kidsbank.api.task.TaskStatus;
import com.kidsbank.api.user.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static com.kidsbank.api.bank.BankDtos.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

  private final AccountService accountService;
  private final AccountRepository accountRepo;
  private final TransactionRepository txRepo;
  private final GoalRepository goalRepo;
  private final FamilyMemberRepository familyMemberRepo;
  private final TaskRepository taskRepo;
  private final UserRepository userRepository;

  public DashboardController(AccountService accountService, AccountRepository accountRepo,
                             TransactionRepository txRepo, GoalRepository goalRepo,
                             FamilyMemberRepository familyMemberRepo, TaskRepository taskRepo,
                             UserRepository userRepository) {
    this.accountService = accountService;
    this.accountRepo = accountRepo;
    this.txRepo = txRepo;
    this.goalRepo = goalRepo;
    this.familyMemberRepo = familyMemberRepo;
    this.taskRepo = taskRepo;
    this.userRepository = userRepository;
  }

  private Long authUserId(org.springframework.security.core.Authentication auth) {
    String username = auth.getName();
    return userRepository.findByUsername(username)
        .map(user -> user.getId())
        .orElseThrow(() -> new RuntimeException("User not found: " + username));
  }

  @GetMapping("/child")
  @PreAuthorize("hasRole('CHILD')")
  public ApiResponse<ChildDashboard> childDashboard(org.springframework.security.core.Authentication auth) {
    Long childId = authUserId(auth);

    // Get accounts
    List<Account> accounts = accountRepo.findAllByOwner_Id(childId);
    Account currentAccount = accounts.stream()
        .filter(a -> a.getType() == AccountType.CURRENT)
        .findFirst()
        .orElse(null);

    if (currentAccount == null) {
      currentAccount = accountService.getOrCreateCurrent(childId);
      accounts.add(currentAccount);
    }

    List<AccountDto> accountDtos = accounts.stream()
        .map(AccountDto::from)
        .collect(Collectors.toList());

    // Get recent transactions (last 10)
    List<Transaction> transactions = new ArrayList<>();
    for (Account acc : accounts) {
      transactions.addAll(txRepo.findAllByAccount_IdOrderByCreatedAtDesc(acc.getId()));
    }
    transactions.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));
    List<TransactionDto> txDtos = transactions.stream()
        .limit(10)
        .map(TransactionDto::from)
        .collect(Collectors.toList());

    // Get active goals
    List<Goal> goals = goalRepo.findAllByChild_IdOrderByCreatedAtDesc(childId);
    List<GoalDto> goalDtos = goals.stream()
        .filter(g -> !g.isCompleted())
        .map(GoalDto::from)
        .collect(Collectors.toList());

    // Calculate stats
    long totalBalance = accounts.stream().mapToLong(Account::getBalance).sum();
    int activeGoals = (int) goals.stream().filter(g -> !g.isCompleted()).count();
    int completedGoals = (int) goals.stream().filter(Goal::isCompleted).count();

    DashboardStats stats = new DashboardStats(
        totalBalance,
        totalBalance / 100.0,
        transactions.size(),
        activeGoals,
        completedGoals
    );

    ChildDashboard dashboard = new ChildDashboard(
        AccountDto.from(currentAccount),
        accountDtos,
        txDtos,
        goalDtos,
        stats
    );

    return ApiResponse.ok("Child dashboard", dashboard);
  }

  @GetMapping("/parent")
  @PreAuthorize("hasRole('PARENT')")
  public ApiResponse<ParentDashboard> parentDashboard(org.springframework.security.core.Authentication auth) {
    Long parentId = authUserId(auth);

    // Get all families where user is parent
    List<FamilyMember> parentMemberships = familyMemberRepo.findAllByUser_Id(parentId);
    List<FamilyAccountSummary> familySummaries = new ArrayList<>();

    long grandTotalBalance = 0;
    int grandTotalTransactions = 0;
    int grandTotalActiveGoals = 0;
    int grandTotalCompletedGoals = 0;

    for (FamilyMember pm : parentMemberships) {
      if (!"PARENT".equals(pm.getMemberRole())) continue;

      Long familyId = pm.getFamily().getId();
      String familyTitle = pm.getFamily().getTitle();

      // Get all children in this family
      List<FamilyMember> members = familyMemberRepo.findAllByFamily_Id(familyId);
      List<ChildAccountSummary> childSummaries = new ArrayList<>();
      long familyTotalBalance = 0;

      for (FamilyMember member : members) {
        if (!"CHILD".equals(member.getMemberRole())) continue;

        Long childId = member.getUser().getId();
        String childUsername = member.getUser().getUsername();

        // Get child's accounts
        List<Account> accounts = accountRepo.findAllByOwner_Id(childId);
        List<AccountDto> accountDtos = accounts.stream()
            .map(AccountDto::from)
            .collect(Collectors.toList());

        long childTotalBalance = accounts.stream().mapToLong(Account::getBalance).sum();
        familyTotalBalance += childTotalBalance;

        // Get child's goals
        List<Goal> goals = goalRepo.findAllByChild_IdOrderByCreatedAtDesc(childId);
        int activeGoals = (int) goals.stream().filter(g -> !g.isCompleted()).count();
        int completedGoals = (int) goals.stream().filter(Goal::isCompleted).count();

        // Get completed tasks count
        int completedTasks = (int) taskRepo.findByChildIdAndStatus(childId, TaskStatus.APPROVED)
            .size();

        grandTotalActiveGoals += activeGoals;
        grandTotalCompletedGoals += completedGoals;

        ChildAccountSummary childSummary = new ChildAccountSummary(
            childId,
            childUsername,
            accountDtos,
            childTotalBalance,
            childTotalBalance / 100.0,
            activeGoals,
            completedTasks
        );
        childSummaries.add(childSummary);
      }

      grandTotalBalance += familyTotalBalance;

      FamilyAccountSummary familySummary = new FamilyAccountSummary(
          familyId,
          familyTitle,
          childSummaries,
          familyTotalBalance,
          familyTotalBalance / 100.0
      );
      familySummaries.add(familySummary);
    }

    DashboardStats totalStats = new DashboardStats(
        grandTotalBalance,
        grandTotalBalance / 100.0,
        grandTotalTransactions,
        grandTotalActiveGoals,
        grandTotalCompletedGoals
    );

    ParentDashboard dashboard = new ParentDashboard(familySummaries, totalStats);
    return ApiResponse.ok("Parent dashboard", dashboard);
  }
}
