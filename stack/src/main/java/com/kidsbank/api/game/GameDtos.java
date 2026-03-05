package com.kidsbank.api.game;

import jakarta.validation.constraints.Min;

public class GameDtos {
  public record FinishRequest(@Min(0) int scorePoints) {}
}