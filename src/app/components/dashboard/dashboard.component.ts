import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Importante para el manejo de inputs en modales
import { LoadDocumentResponse, DocumentFilters } from '../../model/Document';
import { DocumentService } from '../../services/document/document.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { debounceTime, Subject, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private documentService = inject(DocumentService);
  private router = inject(Router);

  // --- Datos de la lista ---
  documents: LoadDocumentResponse[] = [];
  loading = false;
  totalElements = 0;
  totalPages = 0;

  // --- Estados de Modales ---
  showUploadModal = false;
  showDeleteModal = false;
  showEditModal = false;

  // --- Variables auxiliares ---
  selectedFile: File | null = null;
  selectedDoc: LoadDocumentResponse | null = null;
  newName = '';
  uploading = false;
  uploadError = '';

  availableLanguages: string[] = [];
targetLanguage = ''

  // --- Configuración de búsqueda ---
  private personId = '7de063b8-8e64-4312-afde-1615bddf0d76';
  
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
    this.loadLanguages();
  }

  // --- Pipeline de Búsqueda RxJS ---
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

loadLanguages() {
  this.documentService.getAvailableLanguages().subscribe({
    next: (langs) => {
      this.availableLanguages = langs;
      if (langs.length > 0) this.targetLanguage = langs[0]; 
    },
    error: (err) => console.error("Error cargando idiomas", err)
  });
}

  // --- Handlers de Filtros ---
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

  // --- Navegación ---
  goToDocument(documentId: string): void {
    this.router.navigate(['/translation', documentId]);
  }

  // --- Gestión de Subida (Upload) ---
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
      this.router.navigate(['/dashboard', res.documentId]);
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