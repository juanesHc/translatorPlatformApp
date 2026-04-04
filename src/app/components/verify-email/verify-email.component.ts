import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css'
})
export class VerifyEmailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);

  status: 'loading' | 'success' | 'error' = 'loading';
  message = '';

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.status = 'error';
      this.message = 'Token inválido o expirado.';
      return;
    }

    this.http.get(`http://localhost:8080/api/auth/verify`, {
      params: { token },
      responseType: 'text'
    }).subscribe({
      next: () => {
        this.status = 'success';
        this.message = '¡Tu correo ha sido verificado exitosamente!';
      },
      error: () => {
        this.status = 'error';
        this.message = 'El enlace expiró o ya fue usado. Inicia sesión para solicitar uno nuevo.';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}