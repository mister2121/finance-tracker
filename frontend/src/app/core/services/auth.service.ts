import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  login(request: LoginRequest) {
    return this.http
      .post<AuthResponse>('http://localhost:8080/api/auth/login', request)
      .pipe(tap((response) => localStorage.setItem('token', response.token)));
  }

  register(request: RegisterRequest) {
    return this.http.post<AuthResponse>('http://localhost:8080/api/auth/register', request);
  }

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
