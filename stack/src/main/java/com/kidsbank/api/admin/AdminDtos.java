package com.kidsbank.api.admin;

import com.kidsbank.api.bank.Transaction;
import com.kidsbank.api.family.Family;
import com.kidsbank.api.family.FamilyMember;
import com.kidsbank.api.game.Game;
import com.kidsbank.api.user.Role;
import com.kidsbank.api.user.User;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class AdminDtos {

  public record AdminUserDto(
      Long id,
      String username,
      Role role,
      boolean enabled,
      String photoUrl,
      LocalDateTime createdAt
  ) {
    public static AdminUserDto from(User user) {
      return new AdminUserDto(
          user.getId(),
          user.getUsername(),
          user.getRole(),
          user.isEnabled(),
          user.getPhotoUrl(),
          user.getCreatedAt()
      );
    }
  }

  public record AdminGameDto(
      Long id,
      String code,
      String title,
      String description,
      int rewardCoins
  ) {
    public static AdminGameDto from(Game game) {
      return new AdminGameDto(
          game.getId(),
          game.getCode(),
          game.getTitle(),
          game.getDescription(),
          game.getCoinsPer100Points()
      );
    }
  }

  public record AdminTransactionDto(
      Long id,
      String type,
      long amount,
      Long accountId,
      String ownerUsername,
      Long ownerId,
      String note,
      Instant createdAt
  ) {
    public static AdminTransactionDto from(Transaction transaction) {
      return new AdminTransactionDto(
          transaction.getId(),
          transaction.getType().name(),
          transaction.getAmount(),
          transaction.getAccount() != null ? transaction.getAccount().getId() : null,
          transaction.getAccount() != null && transaction.getAccount().getOwner() != null
              ? transaction.getAccount().getOwner().getUsername()
              : null,
          transaction.getAccount() != null && transaction.getAccount().getOwner() != null
              ? transaction.getAccount().getOwner().getId()
              : null,
          transaction.getNote(),
          transaction.getCreatedAt()
      );
    }
  }

  public record AdminFamilyMemberDto(
      Long userId,
      String username,
      String role
  ) {
    public static AdminFamilyMemberDto from(FamilyMember familyMember) {
      return new AdminFamilyMemberDto(
          familyMember.getUser().getId(),
          familyMember.getUser().getUsername(),
          familyMember.getMemberRole()
      );
    }
  }

  public record AdminFamilyDto(
      Long id,
      String title,
      Instant createdAt,
      int totalMembers,
      int totalChildren,
      List<AdminFamilyMemberDto> members
  ) {
    public static AdminFamilyDto from(Family family, List<FamilyMember> members) {
      int childCount = (int) members.stream().filter(member -> "CHILD".equals(member.getMemberRole())).count();
      return new AdminFamilyDto(
          family.getId(),
          family.getTitle(),
          family.getCreatedAt(),
          members.size(),
          childCount,
          members.stream().map(AdminFamilyMemberDto::from).toList()
      );
    }
  }

  public record AdminStatsDto(
      long totalUsers,
      long totalParents,
      long totalChildren,
      long totalAdmins,
      long totalFamilies,
      long totalGames,
      long totalTransactions,
      Map<String, Long> usersByRole
  ) {}
}
