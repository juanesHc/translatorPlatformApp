import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../../services/login/login.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  private loginService = inject(LoginService);
  private router = inject(Router);

  email = '';
  loading = false;
  successMessage = '';
  errorMessage = '';

  sendResetEmail(): void {
    if (!this.email) {
      this.errorMessage = 'Por favor ingresa tu correo';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.loginService.sendForgotPasswordEmail(this.email).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Te enviamos un email para restablecer tu contraseña. Revisa tu bandeja.';
        this.email = '';
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'No encontramos una cuenta con ese correo.';
      }
    });
  }

    goToLogin(): void {
    this.router.navigate(['/login']);
  }

  }



