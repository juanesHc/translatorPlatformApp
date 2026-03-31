import { Component, inject, OnInit } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../../services/admin/admin.service';
import { RoleService } from '../../../services/role/role.service';
import { RoleDto } from '../../../model/Role';
import { RegisterPersonWithRoleRequestDto } from '../../../model/Person';

@Component({
  selector: 'app-role-register',
  standalone: true,
  imports: [FormsModule, SidebarComponent],
  templateUrl: './role-register.component.html',
  styleUrl: './role-register.component.css'
})
export class RoleRegisterComponent implements OnInit {
  private adminService = inject(AdminService);
  private roleService = inject(RoleService);
  private router = inject(Router);

  givenName = '';
  familyName = '';
  email = '';
  password = '';
  confirmPassword = '';
  role = '';
  showPassword = false;
  showConfirmPassword = false;
  errorMessage = '';
  successMessage = '';

roles: RoleDto[] = [];

ngOnInit(): void {
  this.roleService.getRoles().subscribe({
    next: (data) => this.roles = data,
    error: (err) => console.error(err)
  });
}

register(): void {
  this.errorMessage = '';

  if (!this.givenName || !this.familyName || !this.email || !this.password || !this.confirmPassword || !this.role) {
    this.errorMessage = 'Por favor completa todos los campos';
    return;
  }

  if (this.password !== this.confirmPassword) {
    this.errorMessage = 'Las contraseñas no coinciden';
    return;
  }

  const request: RegisterPersonWithRoleRequestDto = {
    givenName: this.givenName,
    familyName: this.familyName,
    email: this.email,
    password: this.password,
    confirmPassword: this.confirmPassword,
    role: this.role
  };

  this.adminService.registerUser(request).subscribe({
    next: (data) => {
      this.successMessage = data.successfulMessage;
      setTimeout(() => this.router.navigate(['/filter-users']), 1500);
    },
    error: (err) => {
      console.error(err);
      this.errorMessage = 'Error al registrar el usuario';
    }
  });
}

  goBack(): void {
    this.router.navigate(['filter-users']);
  }
}
