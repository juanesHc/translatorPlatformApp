import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoleDto } from '../../model/Role';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

private http = inject(HttpClient);

  getRoles(): Observable<RoleDto[]> {
    return this.http.get<RoleDto[]>('http://localhost:8080/api/role/retrieve');
  }
}
