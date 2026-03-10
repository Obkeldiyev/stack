package com.kidsbank.api.user;

import com.kidsbank.api.common.BadRequestException;
import com.kidsbank.api.common.NotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserController.UserProfileDto getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new NotFoundException("User not found"));

        return new UserController.UserProfileDto(
            user.getId(),
            user.getUsername(),
            user.getRole(),
            user.getPhotoUrl(),
            user.isEnabled(),
            user.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
        );
    }

    @Transactional
    public UserController.UserProfileDto updateProfile(Long userId, String username, String photoUrl) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new NotFoundException("User not found"));

        // Check if username is already taken by another user
        if (!user.getUsername().equals(username)) {
            if (userRepository.findByUsername(username).isPresent()) {
                throw new BadRequestException("Username is already taken");
            }
            user.setUsername(username);
        }

        if (photoUrl != null) {
            user.setPhotoUrl(photoUrl);
        }

        User savedUser = userRepository.save(user);

        return new UserController.UserProfileDto(
            savedUser.getId(),
            savedUser.getUsername(),
            savedUser.getRole(),
            savedUser.getPhotoUrl(),
            savedUser.isEnabled(),
            savedUser.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
        );
    }

    @Transactional
    public void changePassword(Long userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new NotFoundException("User not found"));

        // Verify current password
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }

        // Encode and set new password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Transactional
    public String updateProfilePhoto(Long userId, String photoUrl) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new NotFoundException("User not found"));

        user.setPhotoUrl(photoUrl);
        userRepository.save(user);

        return photoUrl;
    }

    public UserController.UserDto getUserDto(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new NotFoundException("User not found"));

        return new UserController.UserDto(
            user.getId(),
            user.getUsername(),
            user.getRole(),
            user.isEnabled()
        );
    }

    public User findById(Long userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new NotFoundException("User not found"));
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new NotFoundException("User not found"));
    }

    @Transactional
    public User createUser(String username, String password, Role role) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new BadRequestException("Username is already taken");
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        user.setEnabled(true);

        return userRepository.save(user);
    }

    @Transactional
    public void enableUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new NotFoundException("User not found"));
        user.setEnabled(true);
        userRepository.save(user);
    }

    @Transactional
    public void disableUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new NotFoundException("User not found"));
        user.setEnabled(false);
        userRepository.save(user);
    }

    public boolean matches(User user, String rawPassword) {
        return passwordEncoder.matches(rawPassword, user.getPassword());
    }
}