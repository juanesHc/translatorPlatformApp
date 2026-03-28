import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { PersonData } from '../../model/Person';
import { PersonService } from '../../services/person/person.service';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  private personService = inject(PersonService);
  private router = inject(Router);


  private personId = '18850e53-7a98-46b2-831a-19758501d3a3';

  personData: PersonData = { firstName: '', lastName: '', email: '' };
  firstName = '';
  lastName = '';

  showEditModal = false;
  showDeactivateModal = false;
  loading = false;
  successMessage = '';

  ngOnInit(): void {
    this.loadPersonData();
  }

  loadPersonData(): void {
    this.personService.getMyData(this.personId).subscribe({
      next: (data) => {
        this.personData = data;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
      },
      error: (err) => console.error(err)
    });
  }

  openEditModal(): void {
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  confirmEdit(): void {
    this.loading = true;
    this.personService.editMyData(this.personId, {
      firstName: this.firstName,
      lastName: this.lastName
    }).subscribe({
      next: () => {
        this.personData.firstName = this.firstName;
        this.personData.lastName = this.lastName;
        this.showEditModal = false;
        this.successMessage = 'Datos actualizados correctamente';
        this.loading = false;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  openDeactivateModal(): void {
    this.showDeactivateModal = true;
  }

  closeDeactivateModal(): void {
    this.showDeactivateModal = false;
  }

  confirmDeactivate(): void {
    this.personService.changeStatusAccount(this.personId).subscribe({
      next: () => {
        this.showDeactivateModal = false;
        this.router.navigate(['/login']);
      },
      error: (err) => console.error(err)
    });
  }

  getInitials(): string {
    return `${this.personData.firstName?.charAt(0) ?? ''}${this.personData.lastName?.charAt(0) ?? ''}`.toUpperCase();
  }
}