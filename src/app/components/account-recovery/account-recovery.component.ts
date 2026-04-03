import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-account-recovery',
  standalone: true,
  imports: [],
  templateUrl: './account-recovery.component.html',
  styleUrl: './account-recovery.component.css'
})
export class AccountRecoveryComponent {
 private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);

  status: 'loading' | 'success' | 'error' = 'loading';
  message = '';

ngOnInit(): void {
  const token = this.route.snapshot.queryParamMap.get('token');
  console.log('Token recibido:', token); // ← ve si llega el token

  if (!token) {
    this.status = 'error';
    this.message = 'Token inválido o expirado.';
    return;
  }

  this.http.get(`http://localhost:8080/api/auth/recover`, {
    params: { token },
    responseType: 'text'
  }).subscribe({
    next: (res) => {
      console.log('Respuesta:', res);
      this.status = 'success';
      this.message = '¡Tu cuenta ha sido recuperada exitosamente!';
    },
    error: (err) => {
      console.log('Error completo:', err); // ← qué error retorna el backend
      this.status = 'error';
      this.message = 'El enlace expiró o ya fue usado. Solicita uno nuevo.';
    }
  });
}

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
