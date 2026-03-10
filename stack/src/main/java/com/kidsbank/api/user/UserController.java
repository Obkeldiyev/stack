package com.kidsbank.api.user;

import com.kidsbank.api.common.ApiResponse;
import com.kidsbank.api.security.CurrentUser;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ApiResponse<UserProfileDto> getProfile(@CurrentUser User currentUser) {
        UserProfileDto profile = userService.getUserProfile(currentUser.getId());
        return ApiResponse.ok("Profile retrieved", profile);
    }

    @PutMapping("/profile")
    public ApiResponse<UserProfileDto> updateProfile(
            @CurrentUser User currentUser,
            @RequestBody @Valid UpdateProfileRequest request) {
        UserProfileDto profile = userService.updateProfile(
            currentUser.getId(),
            request.username(),
            request.photoUrl()
        );
        return ApiResponse.ok("Profile updated", profile);
    }

    @PutMapping("/profile/password")
    public ApiResponse<Void> changePassword(
            @CurrentUser User currentUser,
            @RequestBody @Valid ChangePasswordRequest request) {
        userService.changePassword(
            currentUser.getId(),
            request.currentPassword(),
            request.newPassword()
        );
        return ApiResponse.ok("Password changed successfully", null);
    }

    @PostMapping("/profile/photo")
    public ApiResponse<PhotoUploadResponse> uploadProfilePhoto(
            @CurrentUser User currentUser,
            @RequestBody @Valid PhotoUploadRequest request) {
        String photoUrl = userService.updateProfilePhoto(currentUser.getId(), request.photoUrl());
        return ApiResponse.ok("Profile photo updated", new PhotoUploadResponse(photoUrl));
    }

    @GetMapping("/me")
    public ApiResponse<UserDto> getCurrentUser(@CurrentUser User currentUser) {
        UserDto userDto = userService.getUserDto(currentUser.getId());
        return ApiResponse.ok("User retrieved", userDto);
    }

    // DTOs
    public record UpdateProfileRequest(
        @NotBlank @Size(min = 3, max = 50) String username,
        String photoUrl
    ) {}

    public record ChangePasswordRequest(
        @NotBlank String currentPassword,
        @NotBlank @Size(min = 6, max = 100) String newPassword
    ) {}

    public record PhotoUploadRequest(
        @NotBlank String photoUrl
    ) {}

    public record PhotoUploadResponse(String photoUrl) {}

    public record UserProfileDto(
        Long id,
        String username,
        Role role,
        String photoUrl,
        boolean enabled,
        String createdAt
    ) {}

    public record UserDto(
        Long id,
        String username,
        Role role,
        boolean enabled
    ) {}
}