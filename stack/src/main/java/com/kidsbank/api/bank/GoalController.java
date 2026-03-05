package com.kidsbank.api.bank;

import com.kidsbank.api.common.ApiResponse;
import jakarta.validation.constraints.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
public class GoalController {

  private final GoalService service;

  public GoalController(GoalService service) {
    this.service = service;
  }

  private Long authUserId(org.springframework.security.core.Authentication auth) {
    return Long.parseLong(auth.getPrincipal().toString());
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