import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PersonService } from '../../../services/person/person.service';

@Component({
  selector: 'app-public-register',
  standalone: true,
  imports: [FormsModule,RouterLink],
  templateUrl: './public-register.component.html',
  styleUrl: './public-register.component.css'
})
export class PublicRegisterComponent {
private router = inject(Router);
private personService = inject(PersonService);


  givenName = '';
  familyName = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  showPassword = false;
  showConfirmPassword = false;

    get passwordStrength(): number {
    let score = 0;
    if (/[A-Z]/.test(this.password)) score++;
    if (/[0-9]/.test(this.password)) score++;
    if (/[a-z]/.test(this.password)) score++;
    if (/[^A-Za-z0-9]/.test(this.password)) score++;
    return score;
  }

  get strengthLabel(): string {
    if (this.password.length === 0) return '';
    if (this.passwordStrength <= 1) return 'débil';
    if (this.passwordStrength <= 3) return 'media';
    return 'fuerte';
  }

  get strengthColor(): string {
    if (this.passwordStrength <= 1) return '#ef4444';
    if (this.passwordStrength <= 3) return '#f59e0b';
    return '#10b981';
  }

  get strengthWidth(): string {
    return `${(this.passwordStrength / 4) * 100}%`;
  }

  register(): void {
    if (!this.givenName || !this.familyName || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }
    if (!this.validatePassword()) {
      return;
    }

        if (this.strengthLabel !== 'fuerte') {
      this.errorMessage = 'La contraseña debe ser fuerte para continuar';
      return;
    }

      this.personService.classicRegister({    
        givenName: this.givenName,
        familyName: this.familyName,
        email: this.email,
        password: this.password,
        confirmPassword: this.confirmPassword
      }).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Error al registrar el usuario';
        }
      });
  }

  registerWithGoogle(): void {

    this.router.navigate(['/dashboard']);
  }

  validatePassword(): boolean {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return false;
    }
    return true;
  }
}
