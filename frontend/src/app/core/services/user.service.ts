import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserDeleteRequest, UserPasswordRequest, UserProfileRequest, UserProfileResponse } from '../models/user.model';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);

  updateProfile(request: UserProfileRequest) {
    return this.http.put<UserProfileResponse>('http://localhost:8080/api/users/me', request).pipe(
      tap((updatedUser) => {
        localStorage.setItem('firstName', updatedUser.firstName);
        localStorage.setItem('lastName', updatedUser.lastName);
        localStorage.setItem('email', updatedUser.email);
      }),
    );
  }

  changePassword(request: UserPasswordRequest) {
    return this.http.post<void>('http://localhost:8080/api/users/me/change-password', request);
  }

  deleteAccount(request: UserDeleteRequest) {
    return this.http.delete<void>('http://localhost:8080/api/users/me', { body: request });
  }
}
