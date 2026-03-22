import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslationSummary } from '../../model/Translation';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  constructor() { }

  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/translation';

  getTranslationsByDocument(documentId: string): Observable<TranslationSummary[]> {
    return this.http.get<TranslationSummary[]>(`${this.baseUrl}/document/${documentId}`);
  }

  getTranslationPdf(translationId: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${translationId}/pdf`, { responseType: 'blob' });
  }

    downloadTranslatedPdf(translationId: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${translationId}/pdf`, { responseType: 'blob' });
  }

}
