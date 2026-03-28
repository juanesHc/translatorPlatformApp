import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
 private router = inject(Router);

  email = '';
  password = '';
  errorMessage = '';

  login(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }
    // TODO: conectar al backend cuando implementemos seguridad
    this.router.navigate(['/dashboard']);
  }

  loginWithGoogle(): void {
    // TODO: conectar OAuth2 Google
    this.router.navigate(['/dashboard']);
  }
  
}
