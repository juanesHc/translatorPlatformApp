import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { DocumentSummary } from '../../model/Document';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor() { }

  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/document';

  getDocumentsByPerson(personId: string): Observable<DocumentSummary[]> {
    return this.http.get<DocumentSummary[]>(`${this.baseUrl}/person/${personId}/summary`);
  }

  downloadDocument(documentId: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${documentId}/download`, { responseType: 'blob' });
  }

searchDocuments(personId: string, query: string): Observable<DocumentSummary[]> {
  return this.http.get<any>(
    `${this.baseUrl}/retrieve/${personId}?fileName=${query}&page=0&size=10`
  ).pipe(
    map((response: any) => response.documents)
  );
}

}
