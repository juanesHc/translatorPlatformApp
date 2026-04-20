import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-account-recovery',
  standalone: true,
  imports: [],
  templateUrl: './account-recovery.component.html',
  styleUrl: './account-recovery.component.css'
})
export class AccountRecoveryComponent implements OnInit {
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

    this.http.get(`http://localhost:8080/api/auth/recover`, {
      params: { token },
      responseType: 'text'
    }).subscribe({
      next: () => {
        this.status = 'success';
        this.message = '¡Tu cuenta ha sido recuperada exitosamente!';
      },
      error: () => {
        this.status = 'error';
        this.message = 'El enlace expiró o ya fue usado. Solicita uno nuevo.';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
