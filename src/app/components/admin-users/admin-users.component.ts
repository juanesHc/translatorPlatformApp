import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RetrievePersonResponse, RetrievePersonRequest } from '../../model/Person';
import { AdminService } from '../../services/admin/admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CookiesService } from '../../services/cookies/cookies.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent implements OnInit {
  private adminService = inject(AdminService);
  private router = inject(Router);
  private cookies = inject(CookiesService);
  persons: RetrievePersonResponse[] = [];
  totalPages = 0;
  totalElements = 0;
  currentPage = 0;
  loading = false;

  givenName: string = '';
  avatarInitials: string = '';

  filters: RetrievePersonRequest = {
    givenName: '',
    familyName: '',
    email: '',
    activate: null,
    startDate: '',
    endDate: '',
    page: 0,
    size: 10
  };

  ngOnInit(): void {
        const name = this.cookies.getGivenName();
    if (name) {
      this.givenName = name;
      this.avatarInitials = this.buildInitials(name);
    }
    this.search();
  }

  search(): void {
    this.loading = true;
    const payload = this.buildPayload();
    this.adminService.getPersonsByFilter(payload).subscribe({
      next: (data) => {
        this.persons = data.persons;
        this.totalPages = data.totalPages;
        this.totalElements = data.totalElements;
        this.currentPage = data.currentPage;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  private buildInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }


  clearFilters(): void {
    this.filters = {
      givenName: '',
      familyName: '',
      email: '',
      activate: null,
      startDate: '',
      endDate: '',
      page: 0,
      size: 10
    };
    this.search();
  }

  private buildPayload(): RetrievePersonRequest {
    const payload: any = { page: this.filters.page, size: this.filters.size };
    if (this.filters.givenName) payload.givenName = this.filters.givenName;
    if (this.filters.familyName) payload.familyName = this.filters.familyName;
    if (this.filters.email) payload.email = this.filters.email;
    if (this.filters.activate !== null) payload.activate = this.filters.activate;
    if (this.filters.startDate) payload.startDate = this.filters.startDate;
    if (this.filters.endDate) payload.endDate = this.filters.endDate;
    return payload;
  }

  goToRegister(): void {
    this.router.navigate(['/role-register']);
  }

  prevPage(): void {
    if (this.filters.page > 0) {
      this.filters.page--;
      this.search();
    }
  }

  nextPage(): void {
    if (this.filters.page < this.totalPages - 1) {
      this.filters.page++;
      this.search();
    }
  }

toggleBlock(person: RetrievePersonResponse): void {
  this.adminService.blockPerson(person.personId).subscribe({
    next: (data) => {
      person.block = data.status;
    },
    error: (err) => console.error(err)
  });
}

}
