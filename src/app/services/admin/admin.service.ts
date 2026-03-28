import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RetrievePersonRequest, RetrievePersonPageResponse, AdminRegisterRequest } from '../../model/Person';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/admin';

  getPersonsByFilter(request: RetrievePersonRequest): Observable<RetrievePersonPageResponse> {
    return this.http.post<RetrievePersonPageResponse>(`${this.baseUrl}/retrieve/filter`, request);
  }

  registerUser(request: AdminRegisterRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/register`, request);
  }
}
