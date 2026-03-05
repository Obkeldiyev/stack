package com.kidsbank.api.bank;

import com.kidsbank.api.common.BadRequestException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TransactionService {

  private final AccountService accountService;
  private final TransactionRepository txRepo;
  private final AccountRepository accountRepo;

  public TransactionService(AccountService accountService, TransactionRepository txRepo, AccountRepository accountRepo) {
    this.accountService = accountService;
    this.txRepo = txRepo;
    this.accountRepo = accountRepo;
  }

  public List<Transaction> history(Long accountId, Long ownerId) {
    accountService.getOwned(accountId, ownerId);
    return txRepo.findAllByAccount_IdOrderByCreatedAtDesc(accountId);
  }

  @Transactional
  public Account deposit(Long accountId, Long ownerId, long amount, String note) {
    if (amount <= 0) throw new BadRequestException("Amount must be > 0");
    Account a = accountService.getOwned(accountId, ownerId);
    a.setBalance(a.getBalance() + amount);
    accountRepo.save(a);

    Transaction tx = new Transaction();
    tx.setAccount(a);
    tx.setType(TransactionType.DEPOSIT);
    tx.setAmount(amount);
    tx.setNote(note);
    txRepo.save(tx);

    return a;
  }

  @Transactional
  public Account withdraw(Long accountId, Long ownerId, long amount, String note) {
    if (amount <= 0) throw new BadRequestException("Amount must be > 0");
    Account a = accountService.getOwned(accountId, ownerId);
    if (a.getBalance() < amount) throw new BadRequestException("Insufficient balance");

    a.setBalance(a.getBalance() - amount);
    accountRepo.save(a);

    Transaction tx = new Transaction();
    tx.setAccount(a);
    tx.setType(TransactionType.WITHDRAWAL);
    tx.setAmount(amount);
    tx.setNote(note);
    txRepo.save(tx);

    return a;
  }
}