import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TranslationSummary } from '../../model/Translation';
import { DocumentService } from '../../services/document/document.service';
import { TranslationService } from '../../services/translation/translation.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-document-detail',
  standalone: true,
  imports: [CommonModule, SidebarComponent,FormsModule],
  templateUrl: './translation-detail.component.html',
  styleUrl: './translation-detail.component.css'
})
export class TranslationDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private translationService = inject(TranslationService);
  private documentService = inject(DocumentService);

  documentId: string = '';
  translations: TranslationSummary[] = [];
  loading = false;

  showTranslationModal = false;
  selectedLanguage = '';

  showEmailModal = false;
  selectedTranslationId = '';
  emailTo = '';
  emailSubject = '';
  emailMessage = '';

  ngOnInit(): void {
    this.documentId = this.route.snapshot.paramMap.get('id') ?? '';
    this.loadTranslations();
  }

  loadTranslations(): void {
    this.loading = true;
    this.translationService.getTranslationsByDocument(this.documentId).subscribe({
      next: (data) => {
        this.translations = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  downloadTranslation(translationId: string): void {
    this.translationService.downloadTranslatedPdf(translationId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'translated_document.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error(err)
    });
  }

  downloadOriginal(): void {
    this.documentService.downloadDocument(this.documentId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'original_document.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error(err)
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  viewTranslation(translationId: string): void {
  this.translationService.downloadTranslatedPdf(translationId).subscribe({
    next: (blob) => {
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    },
    error: (err) => console.error(err)
  });
}

languages = this.documentService.getAvailableLanguages(); 
openTranslationModal(): void {
  this.showTranslationModal = true;
}

closeTranslationModal(): void {
  this.showTranslationModal = false;
  this.selectedLanguage = '';
}

requestTranslation(): void {
  if (!this.selectedLanguage) return;

  this.translationService.translateDocument(this.documentId, this.selectedLanguage).subscribe({
    next: () => {
      this.closeTranslationModal();
      this.loadTranslations();
    },
    error: (err) => {
      console.error(err);
      this.closeTranslationModal();
    }
  });
}

openEmailModal(translationId: string): void {
  this.selectedTranslationId = translationId;
  this.showEmailModal = true;
}

closeEmailModal(): void {
  this.showEmailModal = false;
  this.selectedTranslationId = '';
  this.emailTo = '';
  this.emailSubject = '';
  this.emailMessage = '';
}

sendEmail(): void {
  if (!this.emailTo) return;
  // TODO: conectar al endpoint de envío de correo
  console.log('Enviar a:', this.emailTo);
  this.closeEmailModal();
}

sendTranslation(translationId: string): void {
  this.openEmailModal(translationId);
}
}
