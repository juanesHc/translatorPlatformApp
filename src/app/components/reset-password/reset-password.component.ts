import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../services/login/login.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private loginService = inject(LoginService);

  token = '';
  newPassword = '';
  confirmPassword = '';
  loading = false;
  errorMessage = '';

  // Modal
  showModal = false;
  modalSuccess = false;
  modalMessage = '';

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    if (!this.token) {
      this.errorMessage = 'Token inválido o expirado.';
    }
  }

  resetPassword(): void {
    if (!this.token) {
      this.errorMessage = 'Token inválido o expirado.';
      return;
    }
    if (!this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }
    if (this.newPassword.length < 8) {
      this.errorMessage = 'La contraseña debe tener al menos 8 caracteres';
      return;
    }
    if (this.passwordStrength <= 1) {
      this.errorMessage = 'La contraseña es muy débil. Agrega mayúsculas, números o símbolos.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.loginService.resetPassword(this.token, this.newPassword, this.confirmPassword).subscribe({
      next: () => {
        this.loading = false;
        this.modalSuccess = true;
        this.modalMessage = '¡Tu contraseña fue restablecida exitosamente!';
        this.showModal = true;
      },
      error: (err) => {
        this.loading = false;
        this.modalSuccess = false;
        this.modalMessage = err.error?.message || 'Error al restablecer la contraseña.';
        this.showModal = true;
      }
    });
  }

  closeModal(): void {
    this.showModal = false;
    if (this.modalSuccess) {
      this.router.navigate(['/login']);
    }
  }

get passwordStrength(): number {
  let score = 0;
  if (/[A-Z]/.test(this.newPassword)) score++;
  if (/[0-9]/.test(this.newPassword)) score++;
  if (/[a-z]/.test(this.newPassword)) score++;
  if (/[^A-Za-z0-9]/.test(this.newPassword)) score++;
  return score;
}

get strengthLabel(): string {
  if (this.newPassword.length === 0) return '';
  if (this.passwordStrength <= 1) return 'Débil';
  if (this.passwordStrength <= 3) return 'Media';
  return 'Fuerte';
}

get strengthColor(): string {
  if (this.passwordStrength <= 1) return '#ef4444';
  if (this.passwordStrength <= 3) return '#f59e0b';
  return '#10b981';
}

get strengthWidth(): string {
  return `${(this.passwordStrength / 4) * 100}%`;
}

get passwordsMatch(): boolean {
  return this.newPassword === this.confirmPassword && this.confirmPassword.length > 0;
}

get passwordsMismatch(): boolean {
  return this.confirmPassword.length > 0 && this.newPassword !== this.confirmPassword;
}

get hasUppercase(): boolean { return /[A-Z]/.test(this.newPassword); }
get hasLowercase(): boolean { return /[a-z]/.test(this.newPassword); }
get hasNumber(): boolean { return /[0-9]/.test(this.newPassword); }
get hasSpecial(): boolean { return /[^A-Za-z0-9]/.test(this.newPassword); }
get hasMinLength(): boolean { return this.newPassword.length >= 8; }

}