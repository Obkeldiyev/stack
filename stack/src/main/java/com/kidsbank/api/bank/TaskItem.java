package com.kidsbank.api.bank;

import com.kidsbank.api.user.User;
import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "tasks")
public class TaskItem {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "parent_id")
  private User parent;

  @ManyToOne(optional = false)
  @JoinColumn(name = "child_id")
  private User child;

  @Column(nullable = false, length = 80)
  private String title;

  @Column(length = 255)
  private String description;

  @Column(name = "reward_amount", nullable = false)
  private long rewardAmount;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private TaskStatus status;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt = Instant.now();

  @Column(name = "completed_at")
  private Instant completedAt;

  public Long getId() { return id; }
  public User getParent() { return parent; }
  public User getChild() { return child; }
  public String getTitle() { return title; }
  public String getDescription() { return description; }
  public long getRewardAmount() { return rewardAmount; }
  public TaskStatus getStatus() { return status; }
  public Instant getCreatedAt() { return createdAt; }
  public Instant getCompletedAt() { return completedAt; }

  public void setId(Long id) { this.id = id; }
  public void setParent(User parent) { this.parent = parent; }
  public void setChild(User child) { this.child = child; }
  public void setTitle(String title) { this.title = title; }
  public void setDescription(String description) { this.description = description; }
  public void setRewardAmount(long rewardAmount) { this.rewardAmount = rewardAmount; }
  public void setStatus(TaskStatus status) { this.status = status; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
  public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }
}