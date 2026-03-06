package com.kidsbank.api.bank;

import com.kidsbank.api.common.ApiResponse;
import com.kidsbank.api.family.FamilyMemberRepository;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
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
  public record TransferRequest(@NotNull Long childId, @Positive long amount, String note) {}

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

  @GetMapping("/family/{familyId}")
  @PreAuthorize("hasRole('PARENT')")
  public ApiResponse<List<Account>> familyAccounts(@PathVariable Long familyId,
                                                    org.springframework.security.core.Authentication auth) {
    Long parentId = authUserId(auth);
    return ApiResponse.ok("Family accounts", accountService.getFamilyAccounts(parentId, familyId));
  }

  @PostMapping("/transfer")
  @PreAuthorize("hasRole('PARENT')")
  public ApiResponse<Account> transferToChild(@RequestBody TransferRequest req,
                                              org.springframework.security.core.Authentication auth) {
    Long parentId = authUserId(auth);
    Account account = accountService.parentTransfer(parentId, req.childId(), req.amount(), req.note());
    return ApiResponse.ok("Transfer successful", account);
  }
}