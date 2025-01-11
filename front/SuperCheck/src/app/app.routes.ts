import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './guards/auth.guard';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { supervisorGuard } from './guards/supervisor.guard';
import { CreateUserComponent } from './components/user-management/create-user/create-user.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '',
        component: HomeComponent,
        canActivate: [authGuard]
    },
    {
        path: 'users',
        component: UserManagementComponent,
        canActivate: [authGuard, supervisorGuard]
    },
    {
        path: 'users/create',
        component: CreateUserComponent,
        canActivate: [authGuard, supervisorGuard],
        data: { type: 'user' }
    },
    {
        path: 'users/create-motorista',
        component: CreateUserComponent,
        canActivate: [authGuard, supervisorGuard],
        data: { type: 'motorista' }
    },
    {
        path: '**',
        redirectTo: ''
    }
];
