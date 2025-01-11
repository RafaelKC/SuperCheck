import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { supervisorGuard } from './guards/supervisor.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(c => c.HomeComponent),
    canActivate: [authGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'usuarios',
    loadComponent: () => import('./components/user-management/user-management.component').then(c => c.UserManagementComponent),
    canActivate: [authGuard, supervisorGuard]
  },
  {
    path: 'categorias',
    loadComponent: () => import('./components/categoria-management/categoria-management.component').then(c => c.CategoriaManagementComponent),
    canActivate: [authGuard, supervisorGuard]
  }
];
