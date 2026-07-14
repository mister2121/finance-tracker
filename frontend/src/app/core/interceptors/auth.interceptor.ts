import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const router = inject(Router);
  const authService = inject(AuthService);

  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    return next(cloned).pipe(
      catchError((error) => {
        if (error.status === 401 || error.status === 403) {
          authService.logout();
          window.location.href = '/login';
        }
        return throwError(() => error);
      }),
    );
  }

  return next(req);
};
