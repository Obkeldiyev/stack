package com.kidsbank.api.bank;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {
  List<Account> findAllByOwner_Id(Long ownerId);
  Optional<Account> findByIdAndOwner_Id(Long id, Long ownerId);
  Optional<Account> findByOwner_Id(Long ownerId);
}