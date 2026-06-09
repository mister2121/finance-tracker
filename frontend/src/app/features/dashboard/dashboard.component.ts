import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
