import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { filter } from 'rxjs';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private elementRef = inject(ElementRef);
  modalService = inject(ModalService);

  userInitials = this.authService.getUserInitials();
  currentMonth = new Date().toLocaleString('pl-PL', { month: 'long', year: 'numeric' });

  isUserMenuOpen = false;
  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  onLogout() {
    this.authService.logout();
    this.isUserMenuOpen = false;
    this.router.navigate(['/login']);
  }

  // zamknij dropdown menu w nav, jezeli kliknie sie gdziekolwiek na stronie
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInsideNavbar = this.elementRef.nativeElement.contains(event.target);

    if (!clickedInsideNavbar) {
      this.isUserMenuOpen = false;
    }
  }

  //zamyka dropdown menu rowniez jezeli przejdzie sie na inna podstrone (kliknie w jakis link <a>)
  constructor() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.isUserMenuOpen = false;
    });
  }
}
