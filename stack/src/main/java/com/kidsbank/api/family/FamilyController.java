package com.kidsbank.api.family;

import com.kidsbank.api.common.ApiResponse;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.kidsbank.api.family.FamilyDtos.*;

@RestController
@RequestMapping("/api/family")
public class FamilyController {

  private final FamilyService service;

  public FamilyController(FamilyService service) { this.service = service; }

  private Long authUserId(org.springframework.security.core.Authentication auth) { 
    return Long.parseLong(auth.getPrincipal().toString()); 
  }

  @PostMapping("/create")
  @PreAuthorize("hasRole('PARENT')")
  public ApiResponse<Family> create(@RequestBody CreateFamilyRequest req,
                                    org.springframework.security.core.Authentication auth) {
    Long parentId = authUserId(auth);
    return ApiResponse.ok("Family created", service.createFamily(parentId, req.title()));
  }

  @GetMapping("/me")
  public ApiResponse<List<FamilyMember>> myMemberships(org.springframework.security.core.Authentication auth) {
    Long userId = authUserId(auth);
    return ApiResponse.ok("My memberships", service.myMemberships(userId));
  }

  @PostMapping("/{familyId}/invite")
  @PreAuthorize("hasRole('PARENT')")
  public ApiResponse<InviteResponse> invite(@PathVariable Long familyId,
                                            org.springframework.security.core.Authentication auth) {
    Long parentId = authUserId(auth);
    FamilyInvite inv = service.createInvite(parentId, familyId);
    return ApiResponse.ok("Invite created", new InviteResponse(inv.getCode()));
  }

  @PostMapping("/join")
  @PreAuthorize("hasRole('CHILD')")
  public ApiResponse<FamilyMember> join(@RequestBody JoinRequest req,
                                        org.springframework.security.core.Authentication auth) {
    Long childId = authUserId(auth);
    return ApiResponse.ok("Joined family", service.joinByInvite(childId, req.code()));
  }

  @GetMapping("/{familyId}/members")
  @PreAuthorize("hasRole('PARENT')")
  public ApiResponse<List<FamilyMember>> members(@PathVariable Long familyId,
                                                 org.springframework.security.core.Authentication auth) {
    Long parentId = authUserId(auth);
    return ApiResponse.ok("Members", service.listFamilyMembers(parentId, familyId));
  }

  @PutMapping("/{familyId}")
  @PreAuthorize("hasRole('PARENT')")
  public ApiResponse<Family> update(@PathVariable Long familyId,
                                    @RequestBody UpdateFamilyRequest req,
                                    org.springframework.security.core.Authentication auth) {
    Long parentId = authUserId(auth);
    return ApiResponse.ok("Family updated", service.updateFamily(parentId, familyId, req.title()));
  }

  @DeleteMapping("/{familyId}")
  @PreAuthorize("hasRole('PARENT')")
  public ApiResponse<Void> delete(@PathVariable Long familyId,
                                  org.springframework.security.core.Authentication auth) {
    Long parentId = authUserId(auth);
    service.deleteFamily(parentId, familyId);
    return ApiResponse.ok("Family deleted", null);
  }
}