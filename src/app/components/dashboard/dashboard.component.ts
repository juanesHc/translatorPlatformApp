import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Importante para el manejo de inputs en modales
import { LoadDocumentResponse, DocumentFilters } from '../../model/Document';
import { DocumentService } from '../../services/document/document.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { debounceTime, Subject, switchMap, tap } from 'rxjs';
import { CookiesService } from '../../services/cookies/cookies.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private documentService = inject(DocumentService);
  private cookies = inject(CookiesService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  documents: LoadDocumentResponse[] = [];
  loading = false;
  totalElements = 0;
  totalPages = 0;

  showUploadModal = false;
  showDeleteModal = false;
  showEditModal = false;

  selectedFile: File | null = null;
  selectedDoc: LoadDocumentResponse | null = null;
  newName = '';
  uploading = false;
  uploadError = '';

  availableLanguages: string[] = [];
  targetLanguage = ''

  givenName: string = '';
  avatarInitials: string = '';

  private personId = this.cookies.getPersonId()||'';
  
  filters: DocumentFilters = {
    fileName: '',
    createdAt: '',
    targetDate: '',
    page: 0,
    size: 10
  };

  private filterSubject = new Subject<void>();

  ngOnInit(): void {
    if (!this.personId) {
      this.router.navigate(['/login']);
      return;
    }
    const name = this.cookies.getGivenName();
    if (name) {
      this.givenName = name;
      this.avatarInitials = this.buildInitials(name);
    }
    this.initSearchPipeline();
    this.filterSubject.next();
    this.loadLanguages();
  }

  private initSearchPipeline(): void {
    this.filterSubject.pipe(
      debounceTime(400),
      tap(() => this.loading = true),
      switchMap(() => this.documentService.getDocuments(this.personId, this.filters)),
      takeUntilDestroyed(this.destroyRef)
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

    private buildInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }

loadLanguages() {
  this.documentService.getAvailableLanguages().subscribe({
    next: (langs) => {
      this.availableLanguages = langs;
      if (langs.length > 0) this.targetLanguage = langs[0]; 
    },
    error: (err) => console.error("Error cargando idiomas", err)
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
  this.router.navigate(['/translation', documentId]);
}

  openUpload() { 
    this.showUploadModal = true; 
    this.uploadError = ''; 
    this.selectedFile = null;
  }

  closeUpload() { 
    this.showUploadModal = false; 
    this.selectedFile = null; 
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) this.selectedFile = file;
  }

  onFileDropped(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) {
      const allowed = ['.pdf', '.docx', '.txt'];
      const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (allowed.includes(ext)) {
        this.selectedFile = file;
        this.uploadError = '';
      } else {
        this.uploadError = "Formato no permitido (.pdf, .docx, .txt)";
      }
    }
  }


confirmUpload() {
  if (!this.selectedFile || !this.targetLanguage) return; 
  this.uploading = true;
  
  this.documentService.uploadDocument(
    this.personId, 
    this.selectedFile, 
    this.targetLanguage 
  ).subscribe({
    next: (res) => {
      this.uploading = false;
      this.closeUpload();
      this.router.navigate(['/translation', res.documentId]);
    },
    error: (err) => {
      this.uploading = false;
      this.uploadError = 'Error al procesar el archivo. Inténtalo de nuevo.';
    }
  });
}

  confirmDelete(doc: LoadDocumentResponse) {
    this.selectedDoc = doc;
    this.showDeleteModal = true;
  }

  deleteSelectedDoc() {
    if (!this.selectedDoc) return;

    this.documentService.deleteDocument(this.selectedDoc.documentId).subscribe({
      next: () => {
        this.showDeleteModal = false;
        this.selectedDoc = null;
        this.filterSubject.next(); 
      },
      error: (err) => {
        console.error("Error al eliminar:", err);
        alert("No se pudo eliminar el documento.");
      }
    });
  }

  openEditModal(doc: LoadDocumentResponse) {
    this.selectedDoc = doc;
    this.newName = doc.documentName; 
    this.showEditModal = true;
  }

  updateName() {
    if (!this.selectedDoc || !this.newName.trim()) return;
    
    this.documentService.updateName(this.selectedDoc.documentId, this.newName).subscribe({
      next: () => {
        this.showEditModal = false;
        this.filterSubject.next(); 
      },
      error: (err) => alert("No se pudo actualizar el nombre.")
    });
  }
}