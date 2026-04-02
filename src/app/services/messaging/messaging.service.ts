import { inject, Injectable } from '@angular/core';
import { SendEmailRequestDto, SendEmailResponseDto } from '../../model/Messaging';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/messaging';

  sendTranslation(request: SendEmailRequestDto): Observable<SendEmailResponseDto> {
    return this.http.post<SendEmailResponseDto>(`${this.baseUrl}/translation`, request);
  }
}
