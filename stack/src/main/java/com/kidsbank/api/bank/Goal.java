package com.kidsbank.api.bank;

import com.kidsbank.api.user.User;
import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "goals")
public class Goal {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "child_id")
  private User child;

  @Column(nullable = false, length = 80)
  private String title;

  @Column(name = "target_amount", nullable = false)
  private long targetAmount;

  @Column(name = "saved_amount", nullable = false)
  private long savedAmount;

  @Column(name = "is_completed", nullable = false)
  private boolean completed;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt = Instant.now();

  public Long getId() { return id; }
  public User getChild() { return child; }
  public String getTitle() { return title; }
  public long getTargetAmount() { return targetAmount; }
  public long getSavedAmount() { return savedAmount; }
  public boolean isCompleted() { return completed; }
  public Instant getCreatedAt() { return createdAt; }

  public void setId(Long id) { this.id = id; }
  public void setChild(User child) { this.child = child; }
  public void setTitle(String title) { this.title = title; }
  public void setTargetAmount(long targetAmount) { this.targetAmount = targetAmount; }
  public void setSavedAmount(long savedAmount) { this.savedAmount = savedAmount; }
  public void setCompleted(boolean completed) { this.completed = completed; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}