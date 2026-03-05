package com.kidsbank.api.user;

import com.kidsbank.api.common.BadRequestException;
import com.kidsbank.api.common.NotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
  private final UserRepository repo;
  private final PasswordEncoder encoder;

  public UserService(UserRepository repo, PasswordEncoder encoder) {
    this.repo = repo;
    this.encoder = encoder;
  }

  public User register(String username, String rawPassword, Role role) {
    if (repo.existsByUsername(username)) throw new BadRequestException("Username already exists");
    if (rawPassword == null || rawPassword.length() < 6) throw new BadRequestException("Password must be at least 6 chars");

    User u = new User();
    u.setUsername(username.trim());
    u.setPasswordHash(encoder.encode(rawPassword));
    u.setRole(role);
    return repo.save(u);
  }

  public User findByUsername(String username) {
    return repo.findByUsername(username).orElseThrow(() -> new NotFoundException("User not found"));
  }

  public User findById(Long id) {
    return repo.findById(id).orElseThrow(() -> new NotFoundException("User not found"));
  }

  public boolean matches(User user, String rawPassword) {
    return encoder.matches(rawPassword, user.getPasswordHash());
  }
}