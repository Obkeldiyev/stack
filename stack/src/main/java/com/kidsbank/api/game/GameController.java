package com.kidsbank.api.game;

import com.kidsbank.api.common.ApiResponse;
import com.kidsbank.api.common.UnauthorizedException;
import com.kidsbank.api.user.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.kidsbank.api.game.GameDtos.*;

@RestController
@RequestMapping("/api/games")
public class GameController {

  private final GameService service;
  private final UserRepository userRepository;

  public GameController(GameService service, UserRepository userRepository) {
    this.service = service;
    this.userRepository = userRepository;
  }

  private Long authUserId(org.springframework.security.core.Authentication auth) {
    String username = auth.getName();
    return userRepository.findByUsername(username)
        .map(user -> user.getId())
        .orElseThrow(() -> new RuntimeException("User not found: " + username));
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
  public ApiResponse<List<GameSession>> mySessions(org.springframework.security.core.Authentication auth) {
    if (auth == null || auth.getPrincipal() == null) {
      return ApiResponse.ok("My sessions", List.of());
    }
    Long childId = authUserId(auth);
    return ApiResponse.ok("My sessions", service.mySessions(childId));
  }

  @PostMapping("/start/{gameId}")
  public ApiResponse<GameSession> start(@PathVariable Long gameId,
                                        org.springframework.security.core.Authentication auth) {
    if (auth == null) {
      throw new UnauthorizedException("User not authenticated");
    }
    Long childId = authUserId(auth);
    return ApiResponse.ok("Session started", service.start(childId, gameId));
  }

  @PostMapping("/finish/{sessionId}")
  public ApiResponse<GameSession> finish(@PathVariable Long sessionId,
                                         @RequestBody FinishRequest req,
                                         org.springframework.security.core.Authentication auth) {
    if (auth == null) {
      throw new UnauthorizedException("User not authenticated");
    }
    Long childId = authUserId(auth);
    return ApiResponse.ok("Session finished", service.finish(childId, sessionId, req.scorePoints()));
  }
}
