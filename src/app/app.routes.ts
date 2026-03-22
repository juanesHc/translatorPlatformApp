import { Routes } from '@angular/router';

export const routes: Routes = [
     {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component')
      .then(m => m.DashboardComponent)
  },
  {
    path: 'document/:id',
    loadComponent: () => import('./components/document-detail/document-detail.component')
      .then(m => m.DocumentDetailComponent)
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
