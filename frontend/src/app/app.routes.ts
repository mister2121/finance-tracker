import { Routes } from '@angular/router';

import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { authGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { TransactionsComponent } from './features/transactions/transactions.component';
import { AccountsComponent } from './features/accounts/accounts.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'accounts', component: AccountsComponent, canActivate: [authGuard] },
  { path: 'transactions', component: TransactionsComponent, canActivate: [authGuard] },

  { path: '**', redirectTo: 'dashboard' },
];
