import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookiesService } from '../services/cookies/cookies.service';

export const adminGuard: CanActivateFn = (route, state) => {
   const cookieService = inject(CookiesService);
  const router = inject(Router);
  const role = cookieService.decodeToken()?.role;

  if (role === 'ADMIN') {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};
