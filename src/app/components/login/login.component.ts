import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CookiesService } from '../../services/cookies/cookies.service';
import { LoginService } from '../../services/login/login.service';
import { LoginRequestDto } from '../../model/Login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private router = inject(Router);
  private cookies = inject(CookiesService);
  private loginService = inject(LoginService);

  successMessage = '';
  email = '';
  password = '';
  errorMessage = '';
  emailForRecovery = '';

  accountDeleted = false;
  accountUnverified = false;

  login(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    this.accountDeleted = false;
    this.accountUnverified = false;
    this.errorMessage = '';

    const loginData: LoginRequestDto = {
      email: this.email,
      password: this.password
    };

    this.loginService.login(loginData).subscribe({
      next: (response) => {
        this.cookies.setToken(response.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        const message = err.error?.message || '';

        if (message === 'ACCOUNT_DELETED') {
          this.accountDeleted = true;
          this.emailForRecovery = this.email;
        } else if (message === 'ACCOUNT_UNVERIFIED') {
          this.accountUnverified = true;
          this.emailForRecovery = this.email;
        } else {
          this.errorMessage = 'Credenciales inválidas';
        }
      }
    });
  }

  recoverAccount(): void {
    this.loginService.requestRecovery(this.emailForRecovery).subscribe({
      next: () => {
        this.accountDeleted = false;
        this.errorMessage = 'Te enviamos un email para recuperar tu cuenta';
      },
      error: () => {
        this.errorMessage = 'No se pudo enviar el email. Intenta de nuevo.';
      }
    });
  }

resendVerification(): void {
  this.loginService.resendVerification(this.emailForRecovery).subscribe({
    next: () => {
      this.accountUnverified = false;
      // ✅ Mensaje visible fuera del modal
      this.successMessage = 'Te enviamos un email de verificación. Revisa tu bandeja.';
    },
    error: () => {
      this.errorMessage = 'No se pudo enviar el email. Intenta de nuevo.';
    }
  });
}

  loginWithGoogle(): void {
    this.loginService.loginWithGoogle();
  }
}