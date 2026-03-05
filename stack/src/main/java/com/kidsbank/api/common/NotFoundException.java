package com.kidsbank.api.common;

public class NotFoundException extends RuntimeException {
  public NotFoundException(String message) { super(message); }
}