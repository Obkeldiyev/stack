package com.kidsbank.api.family;

import jakarta.validation.constraints.*;

public class FamilyDtos {

  public record CreateFamilyRequest(@NotBlank @Size(min=3, max=80) String title) {}
  public record UpdateFamilyRequest(@NotBlank @Size(min=3, max=80) String title) {}
  public record InviteResponse(String code) {}
  public record JoinRequest(@NotBlank @Size(min=4, max=16) String code) {}
}