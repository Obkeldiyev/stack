package com.kidsbank.api.family;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FamilyMemberRepository extends JpaRepository<FamilyMember, Long> {
  List<FamilyMember> findAllByFamily_Id(Long familyId);
  Optional<FamilyMember> findByFamily_IdAndUser_Id(Long familyId, Long userId);
  List<FamilyMember> findAllByUser_Id(Long userId);
  void deleteAllByFamily_Id(Long familyId);
}