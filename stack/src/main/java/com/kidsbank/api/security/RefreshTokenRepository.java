package com.kidsbank.api.security;

import com.kidsbank.api.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    
    Optional<RefreshToken> findByTokenAndActiveTrue(String token);
    
    List<RefreshToken> findByUserAndActiveTrue(User user);
    
    @Modifying
    @Query("UPDATE RefreshToken rt SET rt.active = false WHERE rt.user = :user")
    void deactivateAllByUser(@Param("user") User user);
    
    @Modifying
    @Query("UPDATE RefreshToken rt SET rt.active = false WHERE rt.expiryDate < :now")
    void deactivateExpiredTokens(@Param("now") LocalDateTime now);
    
    @Modifying
    @Query("DELETE FROM RefreshToken rt WHERE rt.expiryDate < :cutoff")
    void deleteExpiredTokens(@Param("cutoff") LocalDateTime cutoff);
    
    long countByUserAndActiveTrue(User user);
}