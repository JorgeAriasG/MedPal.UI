import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmensService {
  private baseUrl = 'http://localhost:5126/api/appointments';

  constructor(private http: HttpClient) { }

  getAppointments(clinicId: number): Observable<any> {
    const url = `${this.baseUrl}?clinicId=${clinicId}`;
    return this.http.get(url);
  }

  saveAppointment() {

  }
}
