import { Routes } from '@angular/router';

export const routes: Routes = [
     {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component')
      .then(m => m.DashboardComponent)
  },
  {
    path: 'translation/:id',
    loadComponent: () => import('./components/translation-detail/translation-detail.component')
      .then(m => m.TranslationDetailComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/profile/profile.component')
      .then(m => m.ProfileComponent)
  },
    {
    path: 'about',
    loadComponent: () => import('./components/about/about.component')
      .then(m => m.AboutComponent)
  },
  {
  path: 'about',
  loadComponent: () => import('./components/about/about.component')
    .then(m => m.AboutComponent)
},
  
{ path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
{ path: 'register', loadComponent: () => import('./components/register/public-register/public-register.component').then(m => m.PublicRegisterComponent) },
{ path: '', redirectTo: 'login', pathMatch: 'full' },
{
  path: 'not-found',
  loadComponent: () => import('./components/not-found/not-found.component')
    .then(m => m.NotFoundComponent)
},
{
  path: '**',
  redirectTo: 'not-found'
}
];
