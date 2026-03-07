package com.kidsbank.api.game;

import jakarta.persistence.*;

@Entity
@Table(name="games")
public class Game {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable=false, length=60, unique=true)
  private String code; // e.g. "MEMORY", "MATH", "QUIZ"

  @Column(nullable=false, length=80)
  private String title;

  @Column(length=200)
  private String description;

  @Column(nullable=false)
  private int coinsPer100Points; // conversion rate

  public Long getId() { return id; }
  public String getCode() { return code; }
  public String getTitle() { return title; }
  public String getDescription() { return description; }
  public int getCoinsPer100Points() { return coinsPer100Points; }

  public void setId(Long id) { this.id = id; }
  public void setCode(String code) { this.code = code; }
  public void setTitle(String title) { this.title = title; }
  public void setDescription(String description) { this.description = description; }
  public void setCoinsPer100Points(int coinsPer100Points) { this.coinsPer100Points = coinsPer100Points; }
}