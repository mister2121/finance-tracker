import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { LoginRequest } from '../../../core/models/auth.model';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  email: string = '';
  password: string = '';

  emailError: string = '';
  passwordError: string = '';
  loginError: string = '';

  rememberMe: boolean = false;

  // czy pola są puste?
  validateForm(): boolean {
    this.emailError = '';
    this.passwordError = '';
    this.loginError = '';

    let isValid = true;

    if (!this.email.trim()) {
      this.emailError = 'Email jest wymagany';
      isValid = false;
    } else if (!this.isEmailValid()) {
      this.emailError = 'Podaj poprawny adres email';
      isValid = false;
    }

    if (!this.password.trim()) {
      this.passwordError = 'Hasło jest wymagane';
      isValid = false;
    }

    return isValid;
  }

  // czy email jest poprawny?
  isEmailValid(): boolean {
    return this.email.includes('@') && this.email.includes('.');
  }

  clearLoginError() {
    this.loginError = '';
  }

  onSubmit() {
    const formValid = this.validateForm();

    if (!formValid) {
      this.cdr.detectChanges();
      return;
    }

    const request: LoginRequest = {
      email: this.email,
      password: this.password,
    };

    this.authService.login(request).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.loginError = 'Nieprawidłowy email lub hasło';
        this.cdr.detectChanges();
      },
    });
  }
}
