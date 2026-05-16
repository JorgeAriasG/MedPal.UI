import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAppointment } from 'src/app/entities/IAppointment';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class AppointmensService {
  private readonly endpoint = 'appointments';

  constructor(private http: HttpClient, private apiService: ApiService) {}

  getAppointments(clinicId: number | null | undefined, date?: string | null): Observable<any> {
    let url = `${this.endpoint}?clinicId=${clinicId}`;
    if (date) {
      url += `&date=${date}`;
    }
    return this.apiService.get(url);
  }

  saveAppointment(appointment: IAppointment): Observable<any> {
    return this.apiService.post(this.endpoint, appointment);
  }

  updateAppointment(appointment: IAppointment, id: number): Observable<any> {
    const url = `${this.endpoint}/${id}`;
    return this.apiService.put(url, appointment);
  }
}
