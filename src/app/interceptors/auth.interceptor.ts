import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { CookiesService } from '../services/cookies/cookies.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookiesService);
  const router = inject(Router);
  const token = cookieService.getToken();

  const reqConToken = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(reqConToken).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 401:
          console.warn('Sesión expirada, redirigiendo al login...');
          cookieService.deleteToken(); 
          router.navigate(['/login']);
          break;

        case 403:
          console.warn('Acceso denegado');
          router.navigate(['/dashboard']);
          break;

        case 404:
          console.warn('Recurso no encontrado');
          router.navigate(['/not-found']);
          break;
      }
      return throwError(() => error);
    })
  );
};
