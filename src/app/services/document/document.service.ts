import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { DocumentFilters, LoadDocumentResponse, PaginatedDocumentResponse } from '../../model/Document';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/document';

  getDocuments(personId: string, filters: DocumentFilters): Observable<PaginatedDocumentResponse> {
    let params = new HttpParams();
    
    if (filters.fileName) params = params.set('fileName', filters.fileName);
    if (filters.createdAt) params = params.set('createdAt', filters.createdAt);
    if (filters.targetDate) params = params.set('targetDate', filters.targetDate);
    
    params = params.set('page', filters.page.toString());
    params = params.set('size', filters.size.toString());

    return this.http.get<PaginatedDocumentResponse>(`${this.baseUrl}/retrieve/${personId}`, { params });
  }

  downloadDocument(documentId: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${documentId}/download`, { responseType: 'blob' });
  }

}
