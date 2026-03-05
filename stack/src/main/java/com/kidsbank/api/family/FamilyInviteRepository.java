package com.kidsbank.api.family;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FamilyInviteRepository extends JpaRepository<FamilyInvite, Long> {
  Optional<FamilyInvite> findByCode(String code);
  void deleteAllByFamily_Id(Long familyId);
}