import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { LoginRequest } from '../../../core/models/auth.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email: string = '';
  password: string = '';
  errorMessage: string = '';

  onSubmit() {
    const request: LoginRequest = {
      email: this.email,
      password: this.password,
    };

    this.authService.login(request).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        alert('Login failed. Please check your credentials and try again.');
      },
    });
  }
}
