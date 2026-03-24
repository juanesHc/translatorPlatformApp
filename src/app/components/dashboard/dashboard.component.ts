import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadDocumentResponse, DocumentFilters } from '../../model/Document';
import { DocumentService } from '../../services/document/document.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { debounceTime, distinctUntilChanged, Subject, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private documentService = inject(DocumentService);
  private router = inject(Router);

  documents: LoadDocumentResponse[] = [];
  loading = false;
  totalElements = 0;
  totalPages = 0;

  private personId = '24999e2d-25d1-4f67-94a6-e0612d9e4276';
  
  filters: DocumentFilters = {
    fileName: '',
    createdAt: '',
    targetDate: '',
    page: 0,
    size: 10
  };

  private filterSubject = new Subject<void>();

  ngOnInit(): void {
    this.initSearchPipeline();
    this.filterSubject.next();
  }

  private initSearchPipeline(): void {
    this.filterSubject.pipe(
      debounceTime(400), 
      tap(() => this.loading = true),
      switchMap(() => this.documentService.getDocuments(this.personId, this.filters))
    ).subscribe({
      next: (response) => {
        this.documents = response.documents;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando documentos:', err);
        this.loading = false;
      }
    });
  }


  onSearch(query: string): void {
    this.filters.fileName = query;
    this.filters.page = 0; 
    this.filterSubject.next();
  }

  onDateChange(field: 'createdAt' | 'targetDate', value: string): void {
    this.filters[field] = value;
    this.filters.page = 0;
    this.filterSubject.next();
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.filters.page = page;
      this.filterSubject.next();
    }
  }

  goToDocument(documentId: string): void {
    this.router.navigate(['/document', documentId]);
  }
}