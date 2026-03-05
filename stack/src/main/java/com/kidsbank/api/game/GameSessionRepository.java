package com.kidsbank.api.game;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface GameSessionRepository extends JpaRepository<GameSession, Long> {
  List<GameSession> findAllByChild_IdOrderByStartedAtDesc(Long childId);
  Optional<GameSession> findByIdAndChild_Id(Long id, Long childId);
}