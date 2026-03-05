package com.kidsbank.api.security;

import com.kidsbank.api.user.Role;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {
  private final SecretKey key;
  private final String issuer;
  private final long accessTokenMinutes;

  public JwtService(
      @Value("${app.jwt.secret}") String secret,
      @Value("${app.jwt.issuer}") String issuer,
      @Value("${app.jwt.accessTokenMinutes}") long accessTokenMinutes
  ) {
    this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    this.issuer = issuer;
    this.accessTokenMinutes = accessTokenMinutes;
  }

  public String generateAccessToken(Long userId, String username, Role role) {
    Instant now = Instant.now();
    Instant exp = now.plusSeconds(accessTokenMinutes * 60);

    return Jwts.builder()
        .issuer(issuer)
        .subject(String.valueOf(userId))
        .claims(Map.of("username", username, "role", role.name()))
        .issuedAt(Date.from(now))
        .expiration(Date.from(exp))
        .signWith(key, Jwts.SIG.HS256)
        .compact();
  }

  public Jws<Claims> parse(String token) {
    return Jwts.parser().verifyWith(key).requireIssuer(issuer).build().parseSignedClaims(token);
  }
}