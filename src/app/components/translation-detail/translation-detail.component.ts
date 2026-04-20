import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TranslationSummary } from '../../model/Translation';
import { DocumentService } from '../../services/document/document.service';
import { TranslationService } from '../../services/translation/translation.service';
import { FormsModule } from '@angular/forms';
import { SendEmailRequestDto } from '../../model/Messaging';
import { MessagingService } from '../../services/messaging/messaging.service';
import { CookiesService } from '../../services/cookies/cookies.service';


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
  private messagingService = inject(MessagingService);
  private cookieService = inject(CookiesService); // TODO: cuando implementes auth cambia esto por el servicio de auth --- IGNORE ---

  documentId: string = '';
  translations: TranslationSummary[] = [];
  loading = false;

  translationLoading = false;
  translationSuccess = false;
  translationError = false;
  emailSuccess = false;

  showTranslationModal = false;
  selectedLanguage = '';

  showEmailModal = false;
  selectedTranslationId = '';
  emailTo = '';
  emailSubject = '';
  emailMessage = '';
  emailError = '';

  ngOnInit(): void {
    this.documentId = this.route.snapshot.paramMap.get('id') ?? '';
    if (!this.documentId) {
      this.router.navigate(['/dashboard']);
      return;
    }
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
  this.translationLoading = true;
  this.translationSuccess = false;
  this.translationError = false;

  this.translationService.translateDocument(this.documentId, this.selectedLanguage).subscribe({
    next: () => {
      this.translationLoading = false;
      this.translationSuccess = true;
      this.closeTranslationModal();
      this.loadTranslations();
      setTimeout(() => this.translationSuccess = false, 3000);
    },
    error: (err) => {
      console.error(err);
      this.translationLoading = false;
      this.translationError = true;
      this.closeTranslationModal();
      setTimeout(() => this.translationError = false, 3000);
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
  this.emailError = '';
}

sendTranslation(translationId: string): void {
  this.openEmailModal(translationId);
}

sendEmail(): void {
  this.emailError = '';
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!this.emailTo || !emailPattern.test(this.emailTo.trim())) {
    this.emailError = 'Ingresa un correo electrónico válido';
    return;
  }

  const senderEmail = this.cookieService.getEmail() || '';
  if (!senderEmail) {
    this.emailError = 'Sesión expirada. Vuelve a iniciar sesión.';
    return;
  }

  const request: SendEmailRequestDto = {
    translationId: this.selectedTranslationId,
    senderEmail: senderEmail,
    recipientEmail: this.emailTo.trim(),
    subject: this.emailSubject || 'Documento traducido - TranslatorPlatform',
    message: this.emailMessage
  };

  this.messagingService.sendTranslation(request).subscribe({
    next: () => {
      this.closeEmailModal();
      this.emailSuccess = true;
      setTimeout(() => this.emailSuccess = false, 3000);
    },
    error: (err) => {
      console.error(err);
      this.emailError = 'No se pudo enviar el correo. Inténtalo de nuevo.';
    }
  });
}
}
