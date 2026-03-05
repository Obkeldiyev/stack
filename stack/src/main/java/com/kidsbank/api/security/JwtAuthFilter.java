package com.kidsbank.api.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthFilter extends GenericFilter {

  private final JwtService jwtService;

  public JwtAuthFilter(JwtService jwtService) {
    this.jwtService = jwtService;
  }

  @Override
  public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
      throws IOException, ServletException {

    HttpServletRequest request = (HttpServletRequest) req;
    String auth = request.getHeader("Authorization");

    if (auth != null && auth.startsWith("Bearer ")) {
      String token = auth.substring(7);
      try {
        Jws<Claims> parsed = jwtService.parse(token);
        Claims c = parsed.getPayload();

        String userId = c.getSubject();
        String username = c.get("username", String.class);
        String role = c.get("role", String.class);

        var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role));
        // Store userId as principal so it's accessible in controllers
        var authentication = new UsernamePasswordAuthenticationToken(userId, null, authorities);
        SecurityContextHolder.getContext().setAuthentication(authentication);
      } catch (Exception ignored) {
        SecurityContextHolder.clearContext();
      }
    }

    chain.doFilter(req, res);
  }
}