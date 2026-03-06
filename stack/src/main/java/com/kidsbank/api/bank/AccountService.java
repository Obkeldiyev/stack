package com.kidsbank.api.bank;

import com.kidsbank.api.common.BadRequestException;
import com.kidsbank.api.common.NotFoundException;
import com.kidsbank.api.family.FamilyMember;
import com.kidsbank.api.family.FamilyMemberRepository;
import com.kidsbank.api.user.Role;
import com.kidsbank.api.user.User;
import com.kidsbank.api.user.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class AccountService {

  private final AccountRepository repo;
  private final UserService userService;
  private final FamilyMemberRepository familyMemberRepo;
  private final TransactionRepository txRepo;

  public AccountService(AccountRepository repo, UserService userService,
                        FamilyMemberRepository familyMemberRepo, TransactionRepository txRepo) {
    this.repo = repo;
    this.userService = userService;
    this.familyMemberRepo = familyMemberRepo;
    this.txRepo = txRepo;
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
        .orElseThrow(() -> new NotFoundException("Account not found"));
  }

  @Transactional
  public Account getOrCreateCurrent(Long childId) {
    List<Account> all = repo.findAllByOwner_Id(childId);
    for (Account a : all) {
      if (a.getType() == AccountType.CURRENT) return a;
    }
    return createAccount(childId, AccountType.CURRENT);
  }

  public List<Account> getFamilyAccounts(Long parentId, Long familyId) {
    // Verify parent is member of family
    FamilyMember parentMember = familyMemberRepo.findByFamily_IdAndUser_Id(familyId, parentId)
        .orElseThrow(() -> new NotFoundException("Family not found"));
    
    if (!"PARENT".equals(parentMember.getMemberRole())) {
      throw new BadRequestException("Only family PARENT can view accounts");
    }

    // Get all family members
    List<FamilyMember> members = familyMemberRepo.findAllByFamily_Id(familyId);
    List<Account> accounts = new ArrayList<>();
    
    for (FamilyMember member : members) {
      if ("CHILD".equals(member.getMemberRole())) {
        accounts.addAll(repo.findAllByOwner_Id(member.getUser().getId()));
      }
    }
    
    return accounts;
  }

  @Transactional
  public Account parentTransfer(Long parentId, Long childId, long amount, String note) {
    if (amount <= 0) throw new BadRequestException("Amount must be > 0");

    // Verify parent and child are in same family
    User parent = userService.findById(parentId);
    User child = userService.findById(childId);
    
    if (parent.getRole() != Role.PARENT) throw new BadRequestException("Only PARENT can transfer");
    if (child.getRole() != Role.CHILD) throw new BadRequestException("Can only transfer to CHILD");

    // Verify they're in same family
    List<FamilyMember> parentFamilies = familyMemberRepo.findAllByUser_Id(parentId);
    List<FamilyMember> childFamilies = familyMemberRepo.findAllByUser_Id(childId);
    
    boolean inSameFamily = false;
    for (FamilyMember pf : parentFamilies) {
      for (FamilyMember cf : childFamilies) {
        if (pf.getFamily().getId().equals(cf.getFamily().getId())) {
          inSameFamily = true;
          break;
        }
      }
    }
    
    if (!inSameFamily) throw new BadRequestException("Parent and child must be in same family");

    // Get or create child's current account
    Account childAccount = getOrCreateCurrent(childId);
    childAccount.setBalance(childAccount.getBalance() + amount);
    repo.save(childAccount);

    // Create transaction
    Transaction tx = new Transaction();
    tx.setAccount(childAccount);
    tx.setType(TransactionType.PARENT_TRANSFER);
    tx.setAmount(amount);
    tx.setNote(note != null ? note : "Transfer from " + parent.getUsername());
    txRepo.save(tx);

    return childAccount;
  }
}