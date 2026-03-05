package com.kidsbank.api.bank;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
  List<Transaction> findAllByAccount_IdOrderByCreatedAtDesc(Long accountId);
}