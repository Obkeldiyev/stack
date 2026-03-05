package com.kidsbank.api.bank;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "transactions")
public class Transaction {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "account_id")
  private Account account;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 30)
  private TransactionType type;

  @Column(nullable = false)
  private long amount;

  @Column(length = 255)
  private String note;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt = Instant.now();

  public Long getId() { return id; }
  public Account getAccount() { return account; }
  public TransactionType getType() { return type; }
  public long getAmount() { return amount; }
  public String getNote() { return note; }
  public Instant getCreatedAt() { return createdAt; }

  public void setId(Long id) { this.id = id; }
  public void setAccount(Account account) { this.account = account; }
  public void setType(TransactionType type) { this.type = type; }
  public void setAmount(long amount) { this.amount = amount; }
  public void setNote(String note) { this.note = note; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}