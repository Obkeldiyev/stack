package com.kidsbank.api.security;

import com.kidsbank.api.common.BadRequestException;
import com.kidsbank.api.common.NotFoundException;
import com.kidsbank.api.user.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class RefreshTokenService {
    
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;
    
    @Value("${app.jwt.refresh-expiration:604800}") // 7 days in seconds
    private long refreshTokenExpiration;
    
    @Value("${app.jwt.max-refresh-tokens:5}") // Max refresh tokens per user
    private int maxRefreshTokensPerUser;
    
    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository, JwtService jwtService) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtService = jwtService;
    }
    
    @Transactional
    public RefreshToken createRefreshToken(User user) {
        // Clean up expired tokens
        cleanupExpiredTokens();
        
        // Check if user has too many active tokens
        long activeTokenCount = refreshTokenRepository.countByUserAndActiveTrue(user);
        if (activeTokenCount >= maxRefreshTokensPerUser) {
            // Deactivate oldest tokens
            List<RefreshToken> userTokens = refreshTokenRepository.findByUserAndActiveTrue(user);
            userTokens.stream()
                .sorted((t1, t2) -> t1.getCreatedAt().compareTo(t2.getCreatedAt()))
                .limit(activeTokenCount - maxRefreshTokensPerUser + 1)
                .forEach(token -> {
                    token.setActive(false);
                    refreshTokenRepository.save(token);
                });
        }
        
        // Create new refresh token
        String tokenValue = UUID.randomUUID().toString();
        LocalDateTime expiryDate = LocalDateTime.now().plusSeconds(refreshTokenExpiration);
        
        RefreshToken refreshToken = new RefreshToken(tokenValue, user, expiryDate);
        return refreshTokenRepository.save(refreshToken);
    }
    
    @Transactional
    public String refreshAccessToken(String refreshTokenValue) {
        RefreshToken refreshToken = refreshTokenRepository.findByTokenAndActiveTrue(refreshTokenValue)
            .orElseThrow(() -> new BadRequestException("Invalid refresh token"));
        
        if (refreshToken.isExpired()) {
            refreshToken.setActive(false);
            refreshTokenRepository.save(refreshToken);
            throw new BadRequestException("Refresh token expired");
        }
        
        // Update last used time
        refreshToken.setLastUsedAt(LocalDateTime.now());
        refreshTokenRepository.save(refreshToken);
        
        // Generate new access token
        return jwtService.generateAccessToken(refreshToken.getUser().getId(), 
                                            refreshToken.getUser().getUsername(), 
                                            refreshToken.getUser().getRole());
    }
    
    @Transactional
    public void revokeRefreshToken(String refreshTokenValue) {
        RefreshToken refreshToken = refreshTokenRepository.findByTokenAndActiveTrue(refreshTokenValue)
            .orElseThrow(() -> new NotFoundException("Refresh token not found"));
        
        refreshToken.setActive(false);
        refreshTokenRepository.save(refreshToken);
    }
    
    @Transactional
    public void revokeAllUserTokens(User user) {
        refreshTokenRepository.deactivateAllByUser(user);
    }
    
    @Transactional
    public void cleanupExpiredTokens() {
        LocalDateTime now = LocalDateTime.now();
        
        // Deactivate expired tokens
        refreshTokenRepository.deactivateExpiredTokens(now);
        
        // Delete tokens expired more than 30 days ago
        LocalDateTime cutoff = now.minusDays(30);
        refreshTokenRepository.deleteExpiredTokens(cutoff);
    }
    
    public boolean isValidRefreshToken(String refreshTokenValue) {
        return refreshTokenRepository.findByTokenAndActiveTrue(refreshTokenValue)
            .map(token -> !token.isExpired())
            .orElse(false);
    }
}