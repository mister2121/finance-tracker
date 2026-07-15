package com.financetracker.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.financetracker.backend.dto.response.ErrorResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

  // 1. Obsługa błędów walidacji requestów (400 Bad Request)
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
    String message = ex.getBindingResult()
      .getFieldErrors()
      .stream()
      .map(error -> error.getField() + ": " + error.getDefaultMessage())
      .findFirst()
      .orElse("Validation error");
    return ResponseEntity
      .status(HttpStatus.BAD_REQUEST)
      .body(new ErrorResponse(400, message));
  }

  // 2. Obsługa nieprawidłowych argumentów (400 Bad Request)
  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(new ErrorResponse(400, ex.getMessage()));
  }

  // 3. Obsługa zajętego uzytkownika (409 Conflict)
  @ExceptionHandler(UserAlreadyExistsException.class)
  public ResponseEntity<ErrorResponse> handleUserAlreadyExists(UserAlreadyExistsException ex) {
    return ResponseEntity
        .status(HttpStatus.CONFLICT) 
        .body(new ErrorResponse(HttpStatus.CONFLICT.value(), ex.getMessage()));
  }

  // 3. Obsługa braku zasobu (404 Not Found)
  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException ex) {
    return new ResponseEntity<>(
      new ErrorResponse(HttpStatus.NOT_FOUND.value(), ex.getMessage()),
      HttpStatus.NOT_FOUND
    );
  }

  // 4. Obsługa braku dostępu (403 Forbidden)
  @ExceptionHandler(org.springframework.security.access.AccessDeniedException.class)
  public ResponseEntity<ErrorResponse> handleAccessDenied(org.springframework.security.access.AccessDeniedException ex) {
    return new ResponseEntity<>(
      new ErrorResponse(HttpStatus.FORBIDDEN.value(), "You do not have permission to access this resource."),
      HttpStatus.FORBIDDEN
    );
  }

  // 5. Obsługa nieautoryzowanego dostępu (401 Unauthorized)
  @ExceptionHandler(UnauthorizedException.class)
  public ResponseEntity<ErrorResponse> handleUnauthorized(UnauthorizedException ex) {
    return new ResponseEntity<>(
      new ErrorResponse(HttpStatus.UNAUTHORIZED.value(), ex.getMessage()),
      HttpStatus.UNAUTHORIZED
    );
  }

  // 6. Obsługa wszystkich pozostałych wyjątków (500 Internal Server Error)
  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleGeneric(Exception ex) {
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(new ErrorResponse(500, "Internal server error"));
  }
}