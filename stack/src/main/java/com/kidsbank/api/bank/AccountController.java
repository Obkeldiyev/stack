package com.kidsbank.api.bank;

import com.kidsbank.api.common.ApiResponse;
import jakarta.validation.constraints.NotNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

  private final AccountService accountService;

  public AccountController(AccountService accountService) {
    this.accountService = accountService;
  }

  private Long authUserId(org.springframework.security.core.Authentication auth) {
    return Long.parseLong(auth.getPrincipal().toString());
  }

  public record CreateAccountRequest(@NotNull AccountType type) {}

  @GetMapping("/me")
  @PreAuthorize("hasRole('CHILD')")
  public ApiResponse<List<Account>> myAccounts(org.springframework.security.core.Authentication auth) {
    Long userId = authUserId(auth);
    return ApiResponse.ok("My accounts", accountService.myAccounts(userId));
  }

  @PostMapping("/me")
  @PreAuthorize("hasRole('CHILD')")
  public ApiResponse<Account> createMy(@RequestBody CreateAccountRequest req,
                                       org.springframework.security.core.Authentication auth) {
    Long userId = authUserId(auth);
    return ApiResponse.ok("Account created", accountService.createAccount(userId, req.type()));
  }
}