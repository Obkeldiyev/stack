package com.kidsbank.api.bank;

import com.kidsbank.api.common.ApiResponse;
import jakarta.validation.constraints.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

  private final TaskService service;

  public TaskController(TaskService service) {
    this.service = service;
  }

  private Long authUserId(org.springframework.security.core.Authentication auth) {
    return Long.parseLong(auth.getPrincipal().toString());
  }

  public record CreateTaskRequest(
      @NotNull Long childId,
      @NotBlank @Size(min = 3, max = 80) String title,
      @Size(max = 255) String description,
      @Min(1) long rewardAmount
  ) {}

  public record ApproveRequest(@NotNull Long childAccountId) {}
  public record RejectRequest(String reason) {}

  @GetMapping("/parent/me")
  @PreAuthorize("hasRole('PARENT')")
  public ApiResponse<List<TaskItem>> parentTasks(org.springframework.security.core.Authentication auth) {
    Long parentId = authUserId(auth);
    return ApiResponse.ok("Parent tasks", service.parentTasks(parentId));
  }

  @GetMapping("/child/me")
  @PreAuthorize("hasRole('CHILD')")
  public ApiResponse<List<TaskItem>> childTasks(org.springframework.security.core.Authentication auth) {
    Long childId = authUserId(auth);
    return ApiResponse.ok("Child tasks", service.childTasks(childId));
  }

  @PostMapping
  @PreAuthorize("hasRole('PARENT')")
  public ApiResponse<TaskItem> create(@RequestBody CreateTaskRequest req,
                                      org.springframework.security.core.Authentication auth) {
    Long parentId = authUserId(auth);
    return ApiResponse.ok("Task created", service.create(parentId, req.childId(), req.title(), req.description(), req.rewardAmount()));
  }

  @PostMapping("/{taskId}/complete")
  @PreAuthorize("hasRole('CHILD')")
  public ApiResponse<TaskItem> childComplete(@PathVariable Long taskId,
                                             org.springframework.security.core.Authentication auth) {
    Long childId = authUserId(auth);
    return ApiResponse.ok("Marked completed", service.childMarkCompleted(childId, taskId));
  }

  @PostMapping("/{taskId}/approve")
  @PreAuthorize("hasRole('PARENT')")
  public ApiResponse<TaskItem> approve(@PathVariable Long taskId,
                                       @RequestBody ApproveRequest req,
                                       org.springframework.security.core.Authentication auth) {
    Long parentId = authUserId(auth);
    return ApiResponse.ok("Approved and paid", service.parentApproveAndPay(parentId, taskId, req.childAccountId()));
  }

  @PostMapping("/{taskId}/reject")
  @PreAuthorize("hasRole('PARENT')")
  public ApiResponse<TaskItem> reject(@PathVariable Long taskId,
                                      @RequestBody RejectRequest req,
                                      org.springframework.security.core.Authentication auth) {
    Long parentId = authUserId(auth);
    return ApiResponse.ok("Rejected", service.parentReject(parentId, taskId, req.reason()));
  }
}