package com.kidsbank.api.user;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "users")
public class User {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true, length = 50)
  private String username;

  @Column(name="password_hash", nullable = false, length = 200)
  private String passwordHash;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private Role role;

  @Column(name="created_at", nullable = false)
  private Instant createdAt = Instant.now();

  public Long getId() { return id; }
  public String getUsername() { return username; }
  public String getPasswordHash() { return passwordHash; }
  public Role getRole() { return role; }
  public Instant getCreatedAt() { return createdAt; }

  public void setId(Long id) { this.id = id; }
  public void setUsername(String username) { this.username = username; }
  public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
  public void setRole(Role role) { this.role = role; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}