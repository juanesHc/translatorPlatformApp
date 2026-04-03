import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [

  { path: 'login',     loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: 'register',  loadComponent: () => import('./components/register/public-register/public-register.component').then(m => m.PublicRegisterComponent) },
  { path: '',          redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'translation/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./components/translation-detail/translation-detail.component').then(m => m.TranslationDetailComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'about',
    canActivate: [authGuard],
    loadComponent: () => import('./components/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'role-register',
    canActivate: [authGuard],
    loadComponent: () => import('./components/register/role-register/role-register.component').then(m => m.RoleRegisterComponent)
  },

  {
    path: 'filter-users',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./components/admin-users/admin-users.component').then(m => m.AdminUsersComponent)
  },
  {
  path: 'recover',
  loadComponent: () => import('./components/account-recovery/account-recovery.component')
    .then(m => m.AccountRecoveryComponent)
},

  { path: 'not-found', loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent) },
  { path: '**', redirectTo: 'not-found' }
];
