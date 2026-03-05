package com.kidsbank.api.bank;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GoalRepository extends JpaRepository<Goal, Long> {
  List<Goal> findAllByChild_IdOrderByCreatedAtDesc(Long childId);
  Optional<Goal> findByIdAndChild_Id(Long id, Long childId);
}