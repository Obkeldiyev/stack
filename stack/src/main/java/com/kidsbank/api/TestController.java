package com.kidsbank.api;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

  @GetMapping("/")
  public String home() {
    return "KidsBank API is running 🚀";
  }

  @GetMapping("/health")
  public String health() {
    return "OK";
  }
}