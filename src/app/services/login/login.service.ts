import { inject, Injectable } from '@angular/core';
import { CookiesService } from '../cookies/cookies.service';
import { LoginRequestDto, LoginResponseDto } from '../../model/Login';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
constructor(private cookieService: CookiesService) {}

  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/auth';

  loginWithGoogle(): void {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  }

  handleLoginSuccess(token: string): void {
    this.cookieService.setToken(token);
  }

  logout(): void {
    this.cookieService.deleteToken();
  }

  login(request: LoginRequestDto): Observable<LoginResponseDto> {
  return this.http.post<LoginResponseDto>(`${this.baseUrl}/login`, request);
}

  isAuthenticated(): boolean {
    const token = this.cookieService.getToken();
    if (!token) return false;

    const exp = this.cookieService.getExpiration();
    if (exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      return exp > currentTime;
    }
    return true;
  }

requestRecovery(email: string): Observable<string> {
  return this.http.post(`${this.baseUrl}/recover/resend`, null, {
    params: { email },
    responseType: 'text'
  });
}

resendVerification(personId: string): Observable<string> {
  return this.http.post(`${this.baseUrl}/verify/resend`, null, {
    params: { personId },
    responseType: 'text'
  });
}

sendForgotPasswordEmail(email: string): Observable<string> {
  return this.http.post(`${this.baseUrl}/forgot-password`,
    { email },
    { responseType: 'text' }
  );
}

resetPassword(token: string, newPassword: string, confirmPassword: string): Observable<string> {
  return this.http.post(`${this.baseUrl}/reset-password`,
    { token, newPassword, confirmPassword },
    { responseType: 'text' }
  );
}

}
