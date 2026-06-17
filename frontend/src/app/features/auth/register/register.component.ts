import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest } from '../../../core/models/auth.model';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  firstNameError = '';
  lastNameError = '';
  emailError: string = '';
  passwordError: string = '';
  confirmPasswordError = '';

  acceptTerms: boolean = false;
  termsError: string = '';

  isSubmitting = false;

  // 1. czy pola nie są puste?
  // 2. czy email wygląda poprawnie?
  // 3. czy hasła są takie same?
  // 4. wyślij request do backendu
  // 5. jeśli backend mówi 'email zajęty', pokaż błąd emaila

  // sprawdz czy pola nie sa puste
  validateForm(): boolean {
    this.firstNameError = '';
    this.lastNameError = '';
    this.emailError = '';
    this.passwordError = '';
    this.confirmPasswordError = '';

    let isValid = true;

    if (!this.firstName.trim()) {
      this.firstNameError = 'Imię jest wymagane';
      isValid = false;
    } else if (this.firstName.trim().length < 2) {
      this.firstNameError = 'Imię musi mieć minimum 2 znaki';
      isValid = false;
    }

    if (!this.lastName.trim()) {
      this.lastNameError = 'Nazwisko jest wymagane';
      isValid = false;
    } else if (this.lastName.trim().length < 2) {
      this.lastNameError = 'Nazwisko musi mieć minimum 2 znaki';
      isValid = false;
    }

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
    } else if (this.password.length < 4) {
      this.passwordError = 'Hasło musi mieć minimum 4 znaki';
      isValid = false;
    }

    if (!this.confirmPassword.trim()) {
      this.confirmPasswordError = 'Powtórz hasło';
      isValid = false;
    } else if (this.password !== this.confirmPassword) {
      this.confirmPasswordError = 'Hasła nie są identyczne';
      isValid = false;
    }

    if (!this.acceptTerms) {
      this.termsError = 'Musisz zaakceptować regulamin';
      isValid = false;
    }

    return isValid;
  }

  // czy email jest poprawny?
  isEmailValid(): boolean {
    return this.email.includes('@') && this.email.includes('.');
  }

  clearEmailError() {
    this.emailError = '';
  }

  clearTermsError() {
    if (this.acceptTerms) {
      this.termsError = '';
    }
  }

  // próba rejestracji
  onSubmit() {
    const formValid = this.validateForm();

    if (!formValid) {
      this.cdr.detectChanges();
      return;
    }

    this.isSubmitting = true;

    const request: RegisterRequest = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
    };

    this.authService.register(request).subscribe({
      next: () => {
        this.router.navigate(['/login']);
        this.isSubmitting = false;
      },
      error: (error) => {
        this.isSubmitting = false;
        if (error.error?.message === 'Email is already in use') {
          this.emailError = 'Ten email jest już zajęty';
        }
        this.cdr.detectChanges();
      },
    });
  }
}
