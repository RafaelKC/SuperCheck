import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { supervisorGuard } from './guards/supervisor.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'checklists',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'usuarios',
    children: [
      {
        path: '',
        loadComponent: () => import('./components/user-management/user-management.component').then(c => c.UserManagementComponent),
        canActivate: [authGuard, supervisorGuard]
      },
      {
        path: 'create',
        loadComponent: () => import('./components/user-management/create-user/create-user.component').then(c => c.CreateUserComponent),
        canActivate: [authGuard, supervisorGuard]
      },
      {
        path: 'create-motorista',
        loadComponent: () => import('./components/user-management/create-user/create-user.component').then(c => c.CreateUserComponent),
        canActivate: [authGuard, supervisorGuard],
        data: {
          type: 'motorista'
        }
      }
    ]
  },
  {
    path: 'usuarios/create',
    loadComponent: () => import('./components/user-management/user-management.component').then(c => c.UserManagementComponent),
    canActivate: [authGuard, supervisorGuard]
  },
  {
    path: 'categorias',
    loadComponent: () => import('./components/categoria-management/categoria-management.component').then(c => c.CategoriaManagementComponent),
    canActivate: [authGuard, supervisorGuard]
  },
  {
    path: 'templates',
    loadComponent: () => import('./components/template-management/template-management.component').then(m => m.TemplateManagementComponent),
    canActivate: [authGuard]
  },
  {
    path: 'templates/create',
    loadComponent: () => import('./components/template-management/template-form/template-form.component').then(m => m.TemplateFormComponent),
    canActivate: [authGuard, supervisorGuard]
  },
  {
    path: 'templates/:id/edit',
    loadComponent: () => import('./components/template-management/template-form/template-form.component').then(m => m.TemplateFormComponent),
    canActivate: [authGuard, supervisorGuard]
  },
  {
    path: 'checklists',
    loadComponent: () => import('./components/checklist-management/checklist-management.component').then(m => m.ChecklistManagementComponent),
    canActivate: [authGuard]
  },
  {
    path: 'checklists/create',
    loadComponent: () => import('./components/checklist-management/checklist-form/checklist-form.component').then(m => m.ChecklistFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'checklists/:id/edit',
    loadComponent: () => import('./components/checklist-management/checklist-edit/checklist-edit.component').then(m => m.ChecklistEditComponent),
    canActivate: [authGuard]
  },
  {
    path: 'caminhoes',
    loadComponent: () => import('./components/caminhao-management/caminhao-management.component').then(c => c.CaminhaoManagementComponent),
    canActivate: [authGuard, supervisorGuard]
  },
  {
    path: '*',
    redirectTo: 'checklists'
  }
];
