import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-mainlayout',
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  templateUrl: './mainlayout.component.html',
})
export class MainLayoutComponent {}
