import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RetrievePersonRequest, RetrievePersonPageResponse, RegisterPersonWithRoleRequestDto, RegisterPersonWithRoleResponseDto, RetrieveStatusAccountResponse} from '../../model/Person';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/admin';

  getPersonsByFilter(request: RetrievePersonRequest): Observable<RetrievePersonPageResponse> {
    return this.http.post<RetrievePersonPageResponse>(`${this.baseUrl}/retrieve/filter`, request);
  }

registerUser(request: RegisterPersonWithRoleRequestDto): Observable<RegisterPersonWithRoleResponseDto> {
  return this.http.post<RegisterPersonWithRoleResponseDto>(`${this.baseUrl}/register`, request);
}

blockPerson(personId: string): Observable<RetrieveStatusAccountResponse> {
  return this.http.patch<RetrieveStatusAccountResponse>(`${this.baseUrl}/block/${personId}`, {});
}

}
