package com.kidsbank.api.bank;

import com.kidsbank.api.user.User;
import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "accounts")
public class Account {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "owner_id")
  private User owner;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private AccountType type;

  // store money as smallest unit (like "cents" or "tiyin") in BIGINT
  @Column(nullable = false)
  private long balance;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt = Instant.now();

  public Long getId() { return id; }
  public User getOwner() { return owner; }
  public AccountType getType() { return type; }
  public long getBalance() { return balance; }
  public Instant getCreatedAt() { return createdAt; }

  public void setId(Long id) { this.id = id; }
  public void setOwner(User owner) { this.owner = owner; }
  public void setType(AccountType type) { this.type = type; }
  public void setBalance(long balance) { this.balance = balance; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}