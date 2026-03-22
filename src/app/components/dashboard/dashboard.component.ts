import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentSummary } from '../../model/Document';
import { DocumentService } from '../../services/document/document.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';

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

  documents: DocumentSummary[] = [];
  loading = false;

  private personId = '24999e2d-25d1-4f67-94a6-e0612d9e4276';
  searchQuery = '';
  private searchSubject = new Subject<string>();

  ngOnInit(): void {
this.loadDocuments();

  this.searchSubject.pipe(
    debounceTime(400),
    distinctUntilChanged(),
    switchMap(query => {
      if (!query.trim()) {
        return this.documentService.getDocumentsByPerson(this.personId);
      }
      return this.documentService.searchDocuments(this.personId, query);
    })
  ).subscribe({
    next: (data) => this.documents = data,
    error: (err) => console.error(err)
  });
  }

  loadDocuments(): void {
    this.loading = true;
    this.documentService.getDocumentsByPerson(this.personId).subscribe({
      next: (data) => {
        this.documents = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  goToDocument(documentId: string): void {
    this.router.navigate(['/document', documentId]);
  }

  onSearch(query: string): void {
  this.searchQuery = query;
  this.searchSubject.next(query);
}
}