import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAppointment } from 'src/app/entities/IAppointment';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  private readonly endpoint = 'appointments';

  constructor(private http: HttpClient, private apiService: ApiService) {}

  getAppointmentById(id: number): Observable<any> {
    return this.apiService.get(`${this.endpoint}/${id}`);
  }

  getAppointments(clinicId: number | null | undefined, date?: string | null): Observable<any> {
    let url = `${this.endpoint}?clinicId=${clinicId}`;
    if (date) {
      url += `&date=${date}`;
    }
    return this.apiService.get(url);
  }

  getAppointmentsByPatient(patientId: number): Observable<any> {
    return this.apiService.get(`${this.endpoint}/patient/${patientId}`);
  }

  saveAppointment(appointment: IAppointment): Observable<any> {
    return this.apiService.post(this.endpoint, appointment);
  }

  updateAppointment(appointment: IAppointment, id: number): Observable<any> {
    const url = `${this.endpoint}/${id}`;
    return this.apiService.put(url, appointment);
  }

  startConsultation(id: number): Observable<any> {
    return this.apiService.post(`${this.endpoint}/${id}/start`, {});
  }

  completeConsultation(id: number): Observable<any> {
    return this.apiService.post(`${this.endpoint}/${id}/complete`, {});
  }

  cancelAppointment(id: number): Observable<any> {
    return this.apiService.post(`${this.endpoint}/${id}/cancel`, {});
  }

  markNoShow(id: number): Observable<any> {
    return this.apiService.post(`${this.endpoint}/${id}/noshow`, {});
  }

  rescheduleAppointment(id: number, data: any): Observable<any> {
    return this.apiService.put(`${this.endpoint}/${id}/reschedule`, data);
  }

  sendReminder(appointmentId: number): Observable<any> {
    return this.apiService.post(`${this.endpoint}/${appointmentId}/reminder`, {});
  }
}
