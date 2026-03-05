package com.kidsbank.api.bank;

import com.kidsbank.api.common.BadRequestException;
import com.kidsbank.api.user.Role;
import com.kidsbank.api.user.User;
import com.kidsbank.api.user.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AccountService {

  private final AccountRepository repo;
  private final UserService userService;

  public AccountService(AccountRepository repo, UserService userService) {
    this.repo = repo;
    this.userService = userService;
  }

  public List<Account> myAccounts(Long userId) {
    return repo.findAllByOwner_Id(userId);
  }

  @Transactional
  public Account createAccount(Long ownerId, AccountType type) {
    User owner = userService.findById(ownerId);
    if (owner.getRole() != Role.CHILD) throw new BadRequestException("Only CHILD can have accounts");
    Account a = new Account();
    a.setOwner(owner);
    a.setType(type);
    a.setBalance(0);
    return repo.save(a);
  }

  public Account getOwned(Long accountId, Long ownerId) {
    return repo.findByIdAndOwner_Id(accountId, ownerId)
        .orElseThrow(() -> new com.kidsbank.api.common.NotFoundException("Account not found"));
  }

  @Transactional
  public Account getOrCreateCurrent(Long childId) {
    List<Account> all = repo.findAllByOwner_Id(childId);
    for (Account a : all) {
      if (a.getType() == AccountType.CURRENT) return a;
    }
    return createAccount(childId, AccountType.CURRENT);
  }
}