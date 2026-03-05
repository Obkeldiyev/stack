package com.kidsbank.api.family;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name="families")
public class Family {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable=false, length=80)
  private String title;

  @Column(name="created_at", nullable=false)
  private Instant createdAt = Instant.now();

  public Long getId() { return id; }
  public String getTitle() { return title; }
  public Instant getCreatedAt() { return createdAt; }

  public void setId(Long id) { this.id = id; }
  public void setTitle(String title) { this.title = title; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}