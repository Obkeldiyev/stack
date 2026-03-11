package com.kidsbank.api.task;

import com.kidsbank.api.common.ApiResponse;
import com.kidsbank.api.security.CurrentUser;
import com.kidsbank.api.user.User;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    // @PreAuthorize("hasRole('PARENT')") // TEMPORARILY DISABLED
    public ApiResponse<TaskItem> createTask(
            @CurrentUser User currentUser,
            @RequestBody @Valid CreateTaskRequest request) {
        TaskItem task = taskService.createTask(
            currentUser.getId(),
            request.childId(),
            request.title(),
            request.description(),
            request.amount()
        );
        return ApiResponse.ok("Task created", task);
    }

    @GetMapping("/parent")
    // @PreAuthorize("hasRole('PARENT')") // TEMPORARILY DISABLED
    public ApiResponse<List<TaskItem>> getParentTasks(@CurrentUser User currentUser) {
        List<TaskItem> tasks = taskService.getParentTasks(currentUser.getId());
        return ApiResponse.ok("Tasks retrieved", tasks);
    }

    @GetMapping("/child")
    // @PreAuthorize("hasRole('CHILD')") // TEMPORARILY DISABLED
    public ApiResponse<List<TaskItem>> getChildTasks(@CurrentUser User currentUser) {
        List<TaskItem> tasks = taskService.getChildTasks(currentUser.getId());
        return ApiResponse.ok("Tasks retrieved", tasks);
    }

    @PutMapping("/{id}/complete")
    // @PreAuthorize("hasRole('CHILD')") // TEMPORARILY DISABLED
    public ApiResponse<TaskItem> completeTask(
            @PathVariable Long id,
            @CurrentUser User currentUser,
            @RequestBody @Valid CompleteTaskRequest request) {
        TaskItem task = taskService.completeTask(
            id,
            currentUser.getId(),
            request.photoUrl(),
            request.notes()
        );
        return ApiResponse.ok("Task completed", task);
    }

    @PutMapping("/{id}/approve")
    // @PreAuthorize("hasRole('PARENT')") // TEMPORARILY DISABLED
    public ApiResponse<TaskItem> approveTask(
            @PathVariable Long id,
            @CurrentUser User currentUser,
            @RequestBody @Valid ApproveTaskRequest request) {
        TaskItem task = taskService.approveTask(
            id,
            currentUser.getId(),
            request.notes()
        );
        return ApiResponse.ok("Task approved", task);
    }

    @PutMapping("/{id}/reject")
    // @PreAuthorize("hasRole('PARENT')") // TEMPORARILY DISABLED
    public ApiResponse<TaskItem> rejectTask(
            @PathVariable Long id,
            @CurrentUser User currentUser,
            @RequestBody @Valid RejectTaskRequest request) {
        TaskItem task = taskService.rejectTask(
            id,
            currentUser.getId(),
            request.notes()
        );
        return ApiResponse.ok("Task rejected", task);
    }

    @GetMapping("/{id}")
    public ApiResponse<TaskItem> getTask(@PathVariable Long id) {
        TaskItem task = taskService.getTask(id);
        return ApiResponse.ok("Task retrieved", task);
    }

    @DeleteMapping("/{id}")
    // @PreAuthorize("hasRole('PARENT')") // TEMPORARILY DISABLED
    public ApiResponse<Void> deleteTask(
            @PathVariable Long id,
            @CurrentUser User currentUser) {
        taskService.deleteTask(id, currentUser.getId());
        return ApiResponse.ok("Task deleted", null);
    }

    // DTOs
    public record CreateTaskRequest(
        @NotNull Long childId,
        @NotBlank String title,
        String description,
        @NotNull @Positive BigDecimal amount
    ) {}

    public record CompleteTaskRequest(
        @NotBlank String photoUrl,
        String notes
    ) {}

    public record ApproveTaskRequest(
        String notes
    ) {}

    public record RejectTaskRequest(
        @NotBlank String notes
    ) {}
}