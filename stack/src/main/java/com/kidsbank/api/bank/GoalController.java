package com.kidsbank.api.bank;

import com.kidsbank.api.common.ApiResponse;
import com.kidsbank.api.common.UnauthorizedException;
import com.kidsbank.api.user.UserRepository;
import jakarta.validation.constraints.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
public class GoalController {

  private final GoalService service;
  private final UserRepository userRepository;

  public GoalController(GoalService service, UserRepository userRepository) {
    this.service = service;
    this.userRepository = userRepository;
  }

  private Long authUserId(org.springframework.security.core.Authentication auth) {
    if (auth == null || auth.getName() == null) {
      throw new UnauthorizedException("User not authenticated");
    }
    String username = auth.getName();
    return userRepository.findByUsername(username)
        .map(user -> user.getId())
        .orElseThrow(() -> new UnauthorizedException("User not found: " + username));
  }

  public record CreateGoalRequest(@NotBlank @Size(min = 3, max = 80) String title, @Min(1) long targetAmount) {}
  public record SaveRequest(@NotNull Long fromAccountId, @Min(1) long amount) {}

  @GetMapping("/me")
  @PreAuthorize("hasRole('CHILD')")
  public ApiResponse<List<Goal>> myGoals(org.springframework.security.core.Authentication auth) {
    Long childId = authUserId(auth);
    return ApiResponse.ok("My goals", service.myGoals(childId));
  }

  @PostMapping
  @PreAuthorize("hasRole('CHILD')")
  public ApiResponse<Goal> create(@RequestBody CreateGoalRequest req,
                                  org.springframework.security.core.Authentication auth) {
    Long childId = authUserId(auth);
    return ApiResponse.ok("Goal created", service.create(childId, req.title(), req.targetAmount()));
  }

  @PostMapping("/{goalId}/save")
  @PreAuthorize("hasRole('CHILD')")
  public ApiResponse<Goal> save(@PathVariable Long goalId,
                                @RequestBody SaveRequest req,
                                org.springframework.security.core.Authentication auth) {
    Long childId = authUserId(auth);
    return ApiResponse.ok("Saved", service.saveToGoal(childId, goalId, req.fromAccountId(), req.amount()));
  }
}
