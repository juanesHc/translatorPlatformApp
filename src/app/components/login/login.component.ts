import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CookiesService } from '../../services/cookies/cookies.service';
import { LoginService } from '../../services/login/login.service';
import { LoginRequestDto } from '../../model/Login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
 private router = inject(Router);
 private cookies=inject(CookiesService)
 private loginService = inject(LoginService);

  email = '';
  password = '';
  errorMessage = '';

  login(): void {
  if (!this.email || !this.password) {
    this.errorMessage = 'Por favor completa todos los campos';
    return;
  }

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
      this.errorMessage = 'Credenciales incorrectas o error de servidor';
      console.error(err);
    }
  });
}

  loginWithGoogle(): void {
    this.router.navigate(['/dashboard']);
  }
  
}
