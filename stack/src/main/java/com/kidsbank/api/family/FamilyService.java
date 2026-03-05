package com.kidsbank.api.family;

import com.kidsbank.api.common.BadRequestException;
import com.kidsbank.api.common.NotFoundException;
import com.kidsbank.api.user.Role;
import com.kidsbank.api.user.User;
import com.kidsbank.api.user.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.List;

@Service
public class FamilyService {

  private final FamilyRepository familyRepo;
  private final FamilyMemberRepository memberRepo;
  private final FamilyInviteRepository inviteRepo;
  private final UserService userService;

  private static final String ALPH = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  private static final SecureRandom RNG = new SecureRandom();

  public FamilyService(FamilyRepository familyRepo, FamilyMemberRepository memberRepo,
                       FamilyInviteRepository inviteRepo, UserService userService) {
    this.familyRepo = familyRepo;
    this.memberRepo = memberRepo;
    this.inviteRepo = inviteRepo;
    this.userService = userService;
  }

  private String genCode(int len) {
    StringBuilder sb = new StringBuilder(len);
    for (int i = 0; i < len; i++) sb.append(ALPH.charAt(RNG.nextInt(ALPH.length())));
    return sb.toString();
  }

  @Transactional
  public Family createFamily(Long parentId, String title) {
    User parent = userService.findById(parentId);
    if (parent.getRole() != Role.PARENT) throw new BadRequestException("Only PARENT can create family");

    Family f = new Family();
    f.setTitle(title);
    f = familyRepo.save(f);

    FamilyMember m = new FamilyMember();
    m.setFamily(f);
    m.setUser(parent);
    m.setMemberRole("PARENT");
    memberRepo.save(m);

    return f;
  }

  public List<FamilyMember> myMemberships(Long userId) {
    return memberRepo.findAllByUser_Id(userId);
  }

  @Transactional
  public FamilyInvite createInvite(Long parentId, Long familyId) {
    // Ensure parent is a member of that family as PARENT
    FamilyMember parentMember = memberRepo.findByFamily_IdAndUser_Id(familyId, parentId)
        .orElseThrow(() -> new NotFoundException("Family not found or you are not a member"));

    if (!"PARENT".equals(parentMember.getMemberRole())) {
      throw new BadRequestException("Only family PARENT can create invite");
    }

    FamilyInvite inv = new FamilyInvite();
    inv.setFamily(parentMember.getFamily());
    inv.setUsed(false);

    String code;
    do { code = genCode(8); }
    while (inviteRepo.findByCode(code).isPresent());

    inv.setCode(code);
    return inviteRepo.save(inv);
  }

  @Transactional
  public FamilyMember joinByInvite(Long childId, String code) {
    User child = userService.findById(childId);
    if (child.getRole() != Role.CHILD) throw new BadRequestException("Only CHILD can join family");

    FamilyInvite inv = inviteRepo.findByCode(code)
        .orElseThrow(() -> new NotFoundException("Invite code not found"));

    if (inv.isUsed()) throw new BadRequestException("Invite already used");

    FamilyMember existing = memberRepo.findByFamily_IdAndUser_Id(inv.getFamily().getId(), childId).orElse(null);
    if (existing != null) throw new BadRequestException("Child already in this family");

    FamilyMember m = new FamilyMember();
    m.setFamily(inv.getFamily());
    m.setUser(child);
    m.setMemberRole("CHILD");
    m = memberRepo.save(m);

    inv.setUsed(true);
    inv.setUsedAt(Instant.now());
    inviteRepo.save(inv);

    return m;
  }

  public List<FamilyMember> listFamilyMembers(Long parentId, Long familyId) {
    FamilyMember parentMember = memberRepo.findByFamily_IdAndUser_Id(familyId, parentId)
        .orElseThrow(() -> new NotFoundException("Family not found or you are not a member"));

    if (!"PARENT".equals(parentMember.getMemberRole())) {
      throw new BadRequestException("Only family PARENT can view members");
    }
    return memberRepo.findAllByFamily_Id(familyId);
  }

  @Transactional
  public Family updateFamily(Long parentId, Long familyId, String newTitle) {
    FamilyMember parentMember = memberRepo.findByFamily_IdAndUser_Id(familyId, parentId)
        .orElseThrow(() -> new NotFoundException("Family not found or you are not a member"));

    if (!"PARENT".equals(parentMember.getMemberRole())) {
      throw new BadRequestException("Only family PARENT can update family");
    }

    Family family = parentMember.getFamily();
    family.setTitle(newTitle);
    return familyRepo.save(family);
  }

  @Transactional
  public void deleteFamily(Long parentId, Long familyId) {
    FamilyMember parentMember = memberRepo.findByFamily_IdAndUser_Id(familyId, parentId)
        .orElseThrow(() -> new NotFoundException("Family not found or you are not a member"));

    if (!"PARENT".equals(parentMember.getMemberRole())) {
      throw new BadRequestException("Only family PARENT can delete family");
    }

    // Delete all members first
    memberRepo.deleteAllByFamily_Id(familyId);
    // Delete all invites
    inviteRepo.deleteAllByFamily_Id(familyId);
    // Delete family
    familyRepo.deleteById(familyId);
  }
}