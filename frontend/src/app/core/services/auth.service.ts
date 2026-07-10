import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  login(request: LoginRequest) {
    return this.http.post<AuthResponse>('http://localhost:8080/api/auth/login', request).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('email', response.email);
        localStorage.setItem('firstName', response.firstName);
        localStorage.setItem('lastName', response.lastName);
      }),
    );
  }

  register(request: RegisterRequest) {
    return this.http.post<AuthResponse>('http://localhost:8080/api/auth/register', request);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // potrzebne do /profile strony i wyswietlania danych uzytkownika

  getUserInitials(): string {
    const firstName = localStorage.getItem('firstName') || '';
    const lastName = localStorage.getItem('lastName') || '';

    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();

    return `${firstInitial}${lastInitial}`;
  }

  getUserFirstName(): string {
    return localStorage.getItem('firstName') || '';
  }

  getUserLastName(): string {
    return localStorage.getItem('lastName') || '';
  }

  getUserEmail(): string {
    return localStorage.getItem('email') || '';
  }
}
