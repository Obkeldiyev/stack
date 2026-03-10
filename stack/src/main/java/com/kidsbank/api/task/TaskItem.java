package com.kidsbank.api.task;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
public class TaskItem {
  
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  
  @Column(name = "parent_id", nullable = false)
  private Long parentId;
  
  @Column(name = "child_id", nullable = false)
  private Long childId;
  
  @Column(nullable = false)
  private String title;
  
  private String description;
  
  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal amount;
  
  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private TaskStatus status = TaskStatus.PENDING;
  
  private String photoUrl; // URL to uploaded photo
  
  private String childNotes; // Notes from child when completing
  
  private String parentNotes; // Notes from parent when approving/rejecting
  
  @Column(nullable = false)
  private LocalDateTime createdAt = LocalDateTime.now();
  
  private LocalDateTime completedAt;
  
  private LocalDateTime approvedAt;

  // Getters and Setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  
  public Long getParentId() { return parentId; }
  public void setParentId(Long parentId) { this.parentId = parentId; }
  
  public Long getChildId() { return childId; }
  public void setChildId(Long childId) { this.childId = childId; }
  
  public String getTitle() { return title; }
  public void setTitle(String title) { this.title = title; }
  
  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }
  
  public BigDecimal getAmount() { return amount; }
  public void setAmount(BigDecimal amount) { this.amount = amount; }
  
  public TaskStatus getStatus() { return status; }
  public void setStatus(TaskStatus status) { this.status = status; }
  
  public String getPhotoUrl() { return photoUrl; }
  public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }
  
  public String getChildNotes() { return childNotes; }
  public void setChildNotes(String childNotes) { this.childNotes = childNotes; }
  
  public String getParentNotes() { return parentNotes; }
  public void setParentNotes(String parentNotes) { this.parentNotes = parentNotes; }
  
  public LocalDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
  
  public LocalDateTime getCompletedAt() { return completedAt; }
  public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
  
  public LocalDateTime getApprovedAt() { return approvedAt; }
  public void setApprovedAt(LocalDateTime approvedAt) { this.approvedAt = approvedAt; }
}
