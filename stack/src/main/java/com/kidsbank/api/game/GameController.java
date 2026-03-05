package com.kidsbank.api.game;

import com.kidsbank.api.common.ApiResponse;
import jakarta.annotation.PostConstruct;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.kidsbank.api.game.GameDtos.*;

@RestController
@RequestMapping("/api/games")
public class GameController {

  private final GameService service;

  public GameController(GameService service) {
    this.service = service;
  }

  private Long authUserId(org.springframework.security.core.Authentication auth) {
    return Long.parseLong(auth.getPrincipal().toString());
  }

  @PostConstruct
  public void seed() {
    service.ensureGamesSeeded();
  }

  @GetMapping("/public/list")
  public ApiResponse<List<Game>> listPublic() {
    return ApiResponse.ok("Games", service.listGames());
  }

  @GetMapping("/me/sessions")
  @PreAuthorize("hasRole('CHILD')")
  public ApiResponse<List<GameSession>> mySessions(org.springframework.security.core.Authentication auth) {
    Long childId = authUserId(auth);
    return ApiResponse.ok("My sessions", service.mySessions(childId));
  }

  @PostMapping("/start/{gameId}")
  @PreAuthorize("hasRole('CHILD')")
  public ApiResponse<GameSession> start(@PathVariable Long gameId,
                                        org.springframework.security.core.Authentication auth) {
    Long childId = authUserId(auth);
    return ApiResponse.ok("Session started", service.start(childId, gameId));
  }

  @PostMapping("/finish/{sessionId}")
  @PreAuthorize("hasRole('CHILD')")
  public ApiResponse<GameSession> finish(@PathVariable Long sessionId,
                                         @RequestBody FinishRequest req,
                                         org.springframework.security.core.Authentication auth) {
    Long childId = authUserId(auth);
    return ApiResponse.ok("Session finished", service.finish(childId, sessionId, req.scorePoints()));
  }
}