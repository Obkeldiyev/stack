package com.kidsbank.api.user;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true, length = 50)
  private String username;

  @Column(name="password_hash", nullable = false, length = 200)
  private String password;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private Role role;

  @Column(nullable = false)
  private boolean enabled = true;

  @Column(name="photo_url", length = 500)
  private String photoUrl;

  @Column(name="created_at", nullable = false)
  private LocalDateTime createdAt = LocalDateTime.now();

  public Long getId() { return id; }
  public String getUsername() { return username; }
  public String getPassword() { return password; }
  public Role getRole() { return role; }
  public boolean isEnabled() { return enabled; }
  public String getPhotoUrl() { return photoUrl; }
  public LocalDateTime getCreatedAt() { return createdAt; }

  public void setId(Long id) { this.id = id; }
  public void setUsername(String username) { this.username = username; }
  public void setPassword(String password) { this.password = password; }
  public void setRole(Role role) { this.role = role; }
  public void setEnabled(boolean enabled) { this.enabled = enabled; }
  public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }
  public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}