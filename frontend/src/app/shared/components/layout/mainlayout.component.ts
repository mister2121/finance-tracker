import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { ModalService } from '../../../core/services/modal.service';
import { AddTransactionModal } from '../../../features/transactions/add-transaction-modal/add-transaction-modal';

@Component({
  selector: 'app-mainlayout',
  imports: [CommonModule, RouterOutlet, NavbarComponent, AddTransactionModal],
  templateUrl: './mainlayout.component.html',
})
export class MainLayoutComponent {
  modalService = inject(ModalService);
}
