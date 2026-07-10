import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { FormsModule } from '@angular/forms';
import {
  UserDeleteRequest,
  UserPasswordRequest,
  UserProfileRequest,
} from '../../core/models/user.model';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);

  userInitials = '';
  firstName = '';
  lastName = '';
  email = '';

  editFirstName = '';
  editLastName = '';
  editEmail = '';

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  deletePassword = '';

  // --- błędy: dane profilu ---
  firstNameError = '';
  lastNameError = '';
  emailError = '';
  profileError = '';

  // --- błędy: zmiana hasła ---
  currentPasswordError = '';
  newPasswordError = '';
  confirmPasswordError = '';
  passwordFormError = '';

  // --- błędy: usuwanie konta ---
  deletePasswordError = '';

  ngOnInit(): void {
    this.loadUser();

    this.editFirstName = this.firstName;
    this.editLastName = this.lastName;
    this.editEmail = this.email;
  }

  private loadUser(): void {
    this.userInitials = this.authService.getUserInitials();
    this.firstName = this.authService.getUserFirstName();
    this.lastName = this.authService.getUserLastName();
    this.email = this.authService.getUserEmail();
  }

  private isEmailValid(): boolean {
    return this.editEmail.includes('@') && this.editEmail.includes('.');
  }

  // czyszczenie błędów przy wpisywaniu
  clearProfileError(): void {
    this.profileError = '';
  }

  clearPasswordFormError(): void {
    this.passwordFormError = '';
  }

  // ---------- WALIDACJA: DANE PROFILU ----------
  validateProfileForm(): boolean {
    this.firstNameError = '';
    this.lastNameError = '';
    this.emailError = '';
    this.profileError = '';

    let isValid = true;

    if (!this.editFirstName.trim()) {
      this.firstNameError = 'Imię jest wymagane';
      isValid = false;
    }

    if (!this.editLastName.trim()) {
      this.lastNameError = 'Nazwisko jest wymagane';
      isValid = false;
    }

    if (!this.editEmail.trim()) {
      this.emailError = 'Email jest wymagany';
      isValid = false;
    } else if (!this.isEmailValid()) {
      this.emailError = 'Podaj poprawny adres email';
      isValid = false;
    }

    return isValid;
  }

  // ---------- WALIDACJA: ZMIANA HASŁA ----------
  validatePasswordForm(): boolean {
    this.currentPasswordError = '';
    this.newPasswordError = '';
    this.confirmPasswordError = '';
    this.passwordFormError = '';

    let isValid = true;

    if (!this.currentPassword.trim()) {
      this.currentPasswordError = 'Aktualne hasło jest wymagane';
      isValid = false;
    }

    if (!this.newPassword.trim()) {
      this.newPasswordError = 'Nowe hasło jest wymagane';
      isValid = false;
    } else if (this.newPassword.length < 8) {
      this.newPasswordError = 'Nowe hasło musi mieć co najmniej 8 znaków';
      isValid = false;
    }

    if (!this.confirmPassword.trim()) {
      this.confirmPasswordError = 'Powtórzenie hasła jest wymagane';
      isValid = false;
    } else if (this.newPassword && this.confirmPassword !== this.newPassword) {
      this.confirmPasswordError = 'Hasła nie są identyczne';
      isValid = false;
    }

    return isValid;
  }

  // ---------- WALIDACJA: USUWANIE KONTA ----------
  validateDeleteForm(): boolean {
    this.deletePasswordError = '';

    if (!this.deletePassword.trim()) {
      this.deletePasswordError = 'Hasło jest wymagane, aby potwierdzić usunięcie konta';
      return false;
    }

    return true;
  }

  // Zapisywanie zmian profilu
  onUpdateProfile(): void {
    const formValid = this.validateProfileForm();

    if (!formValid) {
      this.cdr.detectChanges();
      return;
    }

    const request: UserProfileRequest = {
      firstName: this.editFirstName,
      lastName: this.editLastName,
      email: this.editEmail,
    };

    this.userService.updateProfile(request).subscribe({
      next: () => {
        const emailChanged = this.editEmail !== this.email;

        if (emailChanged) {
          alert('Email zmieniony. Zaloguj się ponownie.');
          this.authService.logout();
          window.location.href = '/login';
          return;
        }

        this.loadUser();
        this.editFirstName = this.firstName;
        this.editLastName = this.lastName;
        this.editEmail = this.email;
        alert('Profil zmieniony poprawnie.');
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Błąd podczas aktualizacji profilu:', error);
        this.profileError = error?.error?.message ?? 'Nie udało się zmienić profilu.';
        this.cdr.detectChanges();
      },
    });
  }

  // Zmiana hasła
  onChangePassword(): void {
    const formValid = this.validatePasswordForm();

    if (!formValid) {
      this.cdr.detectChanges();
      return;
    }

    const request: UserPasswordRequest = {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
    };

    this.userService.changePassword(request).subscribe({
      next: () => {
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
        alert('Hasło zmienione poprawnie.');
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Błąd podczas zmiany hasła:', error);
        this.passwordFormError = error?.error?.message ?? 'Nie udało się zmienić hasła.';
        this.cdr.detectChanges();
      },
    });
  }

  // Usuwanie konta
  onDeleteAccount(): void {
    const formValid = this.validateDeleteForm();

    if (!formValid) {
      this.cdr.detectChanges();
      return;
    }

    const confirmed = confirm('Czy na pewno chcesz usunąć konto? Tej operacji nie można cofnąć.');
    if (!confirmed) {
      return;
    }

    const request: UserDeleteRequest = { password: this.deletePassword };

    this.userService.deleteAccount(request).subscribe({
      next: () => {
        this.authService.logout();
        window.location.href = '/login';
      },
      error: (error) => {
        console.error('Błąd podczas usuwania konta:', error);
        this.deletePasswordError = error?.error?.message ?? 'Nie udało się usunąć konta.';
        this.deletePassword = '';
        this.cdr.detectChanges();
      },
    });
  }
}
