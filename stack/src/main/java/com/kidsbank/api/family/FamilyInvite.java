package com.kidsbank.api.family;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name="family_invites", uniqueConstraints = @UniqueConstraint(columnNames = {"code"}))
public class FamilyInvite {

  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional=false)
  @JoinColumn(name="family_id")
  private Family family;

  @Column(nullable=false, length=16)
  private String code;

  @Column(nullable=false)
  private boolean used;

  @Column(name="created_at", nullable=false)
  private Instant createdAt = Instant.now();

  @Column(name="used_at")
  private Instant usedAt;

  public Long getId() { return id; }
  public Family getFamily() { return family; }
  public String getCode() { return code; }
  public boolean isUsed() { return used; }
  public Instant getCreatedAt() { return createdAt; }
  public Instant getUsedAt() { return usedAt; }

  public void setId(Long id) { this.id = id; }
  public void setFamily(Family family) { this.family = family; }
  public void setCode(String code) { this.code = code; }
  public void setUsed(boolean used) { this.used = used; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
  public void setUsedAt(Instant usedAt) { this.usedAt = usedAt; }
}