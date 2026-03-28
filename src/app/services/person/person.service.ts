import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PersonData, EditPersonRequest, RegisterRequest } from '../../model/Person';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

 private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/user';

  getMyData(personId: string): Observable<PersonData> {
    return this.http.get<PersonData>(`${this.baseUrl}/retrieve/data/${personId}`);
  }

  editMyData(personId: string, data: EditPersonRequest): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.baseUrl}/update/data/${personId}`, data);
  }

  changeStatusAccount(personId: string): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.baseUrl}/status/${personId}`, {});
  }

  classicRegister(data: RegisterRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/register/classic`, data);
  }
}
