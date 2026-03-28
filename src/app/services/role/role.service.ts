import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

private http = inject(HttpClient);

  getRoles(): Observable<{ id: string; type: string }[]> {
  return this.http.get<{ id: string; type: string }[]>('http://localhost:8080/api/role/retrieve');
}
}
