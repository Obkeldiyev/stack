package com.kidsbank.api.family;

import com.kidsbank.api.user.User;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name="family_members",
    uniqueConstraints = @UniqueConstraint(columnNames = {"family_id","user_id"}))
public class FamilyMember {

  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional=false)
  @JoinColumn(name="family_id")
  private Family family;

  @ManyToOne(optional=false)
  @JoinColumn(name="user_id")
  private User user;

  @Column(nullable=false, length=20)
  private String memberRole;

  @Column(name="joined_at", nullable=false)
  private Instant joinedAt = Instant.now();

  public Long getId() { return id; }
  public Family getFamily() { return family; }
  public User getUser() { return user; }
  public String getMemberRole() { return memberRole; }
  public Instant getJoinedAt() { return joinedAt; }

  public void setId(Long id) { this.id = id; }
  public void setFamily(Family family) { this.family = family; }
  public void setUser(User user) { this.user = user; }
  public void setMemberRole(String memberRole) { this.memberRole = memberRole; }
  public void setJoinedAt(Instant joinedAt) { this.joinedAt = joinedAt; }
}