package com.kidsbank.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.*;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
public class CorsConfig {

  @Bean
  public CorsFilter corsFilter() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowCredentials(true);

    // DEV: allow any origin pattern
    config.setAllowedOriginPatterns(List.of("*"));

    config.setAllowedHeaders(List.of("*"));
    config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","PATCH","OPTIONS"));

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);

    return new CorsFilter(source);
  }
}