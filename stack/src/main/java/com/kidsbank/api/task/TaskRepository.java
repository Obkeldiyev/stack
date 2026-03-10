package com.kidsbank.api.task;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<TaskItem, Long> {
    
    List<TaskItem> findByParentIdOrderByCreatedAtDesc(Long parentId);
    
    List<TaskItem> findByChildIdOrderByCreatedAtDesc(Long childId);
    
    List<TaskItem> findByStatusOrderByCreatedAtDesc(TaskStatus status);
    
    @Query("SELECT t FROM TaskItem t WHERE t.parentId = :parentId AND t.status = :status ORDER BY t.createdAt DESC")
    List<TaskItem> findByParentIdAndStatus(@Param("parentId") Long parentId, @Param("status") TaskStatus status);
    
    @Query("SELECT t FROM TaskItem t WHERE t.childId = :childId AND t.status = :status ORDER BY t.createdAt DESC")
    List<TaskItem> findByChildIdAndStatus(@Param("childId") Long childId, @Param("status") TaskStatus status);
    
    long countByParentIdAndStatus(Long parentId, TaskStatus status);
    
    long countByChildIdAndStatus(Long childId, TaskStatus status);
}