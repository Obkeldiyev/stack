package com.kidsbank.api.game;

import com.kidsbank.api.user.User;
import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name="game_sessions")
public class GameSession {

  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional=false)
  @JoinColumn(name="child_id")
  private User child;

  @ManyToOne(optional=false)
  @JoinColumn(name="game_id")
  private Game game;

  @Column(nullable=false)
  private boolean finished;

  @Column(nullable=false)
  private int scorePoints;

  @Column(nullable=false)
  private long coinsEarned;

  @Column(name="started_at", nullable=false)
  private Instant startedAt = Instant.now();

  @Column(name="finished_at")
  private Instant finishedAt;

  public Long getId() { return id; }
  public User getChild() { return child; }
  public Game getGame() { return game; }
  public boolean isFinished() { return finished; }
  public int getScorePoints() { return scorePoints; }
  public long getCoinsEarned() { return coinsEarned; }
  public Instant getStartedAt() { return startedAt; }
  public Instant getFinishedAt() { return finishedAt; }

  public void setId(Long id) { this.id = id; }
  public void setChild(User child) { this.child = child; }
  public void setGame(Game game) { this.game = game; }
  public void setFinished(boolean finished) { this.finished = finished; }
  public void setScorePoints(int scorePoints) { this.scorePoints = scorePoints; }
  public void setCoinsEarned(long coinsEarned) { this.coinsEarned = coinsEarned; }
  public void setStartedAt(Instant startedAt) { this.startedAt = startedAt; }
  public void setFinishedAt(Instant finishedAt) { this.finishedAt = finishedAt; }
}