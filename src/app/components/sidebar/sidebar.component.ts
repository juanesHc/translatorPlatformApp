import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CookiesService } from '../../services/cookies/cookies.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  role: string = '';
  private router = inject(Router);
  private cookieService = inject(CookiesService);

  ngOnInit(): void {
    this.role = this.cookieService.getRole() || 'COMMON';
  }

  get isAdmin(): boolean {
    return this.role === 'ADMIN';
  }

  logout(): void {
    this.cookieService.deleteToken();
    this.router.navigate(['/login']);
  }
}