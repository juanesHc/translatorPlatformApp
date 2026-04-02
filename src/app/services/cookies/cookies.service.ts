import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CookiesService {

private readonly TOKEN_KEY = 'jwt_token';

  constructor() {}

  setToken(token: string): void {
    const date = new Date();
    date.setTime(date.getTime() + (24 * 60 * 60 * 1000));
    document.cookie = `${this.TOKEN_KEY}=${token}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
  }

  getToken(): string | null {
    const name = `${this.TOKEN_KEY}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
    }
    return null;
  }

  deleteToken(): void {
    document.cookie = `${this.TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

 decodeToken(): any {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  }


  getRole(): string | null {
    return this.decodeToken()?.role || null;
  }

  getPersonId(): string | null {
    return this.decodeToken()?.personId || null;
  }

  getGivenName(): string | null {
    return this.decodeToken()?.givenName || null;
  }

  getEmail(): string | null {
    return this.decodeToken()?.email || null;
  }

  isBlock(): boolean {
    return !!this.decodeToken()?.block;
  }

  isActivate(): boolean {
    return !!this.decodeToken()?.activate;
  }

  getExpiration(): number | null {
    return this.decodeToken()?.exp || null;
  }
}
