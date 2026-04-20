import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookiesService } from '../services/cookies/cookies.service';
import { LoginService } from '../services/login/login.service';

export const authGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookiesService);
  const loginService = inject(LoginService);
  const router = inject(Router);

  if (loginService.isAuthenticated()) {
    return true;
  }

  cookieService.deleteToken();
  router.navigate(['/login']);
  return false;
};
