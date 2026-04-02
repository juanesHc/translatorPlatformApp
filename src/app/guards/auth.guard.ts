import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookiesService } from '../services/cookies/cookies.service';

export const authGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookiesService);
  const router = inject(Router);
  const token = cookieService.getToken();

  if (token) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
