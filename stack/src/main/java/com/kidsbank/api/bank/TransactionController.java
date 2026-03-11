package com.kidsbank.api.bank;

import com.kidsbank.api.common.ApiResponse;
import com.kidsbank.api.common.UnauthorizedException;
import com.kidsbank.api.user.UserRepository;
import jakarta.validation.constraints.Min;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

  private final TransactionService txService;
  private final UserRepository userRepository;

  public TransactionController(TransactionService txService, UserRepository userRepository) {
    this.txService = txService;
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

  public record MoneyRequest(@Min(1) long amount, String note) {}

  @GetMapping("/accounts/{accountId}")
  @PreAuthorize("hasRole('CHILD')")
  public ApiResponse<List<Transaction>> history(@PathVariable Long accountId,
                                                org.springframework.security.core.Authentication auth) {
    Long userId = authUserId(auth);
    return ApiResponse.ok("History", txService.history(accountId, userId));
  }

  @PostMapping("/accounts/{accountId}/deposit")
  @PreAuthorize("hasRole('CHILD')")
  public ApiResponse<Account> deposit(@PathVariable Long accountId,
                                      @RequestBody MoneyRequest req,
                                      org.springframework.security.core.Authentication auth) {
    Long userId = authUserId(auth);
    return ApiResponse.ok("Deposited", txService.deposit(accountId, userId, req.amount(), req.note()));
  }

  @PostMapping("/accounts/{accountId}/withdraw")
  @PreAuthorize("hasRole('CHILD')")
  public ApiResponse<Account> withdraw(@PathVariable Long accountId,
                                       @RequestBody MoneyRequest req,
                                       org.springframework.security.core.Authentication auth) {
    Long userId = authUserId(auth);
    return ApiResponse.ok("Withdrawn", txService.withdraw(accountId, userId, req.amount(), req.note()));
  }
}
