package com.kidsbank.api.bank;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<TaskItem, Long> {
  List<TaskItem> findAllByParent_IdOrderByCreatedAtDesc(Long parentId);
  List<TaskItem> findAllByChild_IdOrderByCreatedAtDesc(Long childId);
  Optional<TaskItem> findByIdAndParent_Id(Long id, Long parentId);
  Optional<TaskItem> findByIdAndChild_Id(Long id, Long childId);
}