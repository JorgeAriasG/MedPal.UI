import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface BookingCompleteRequest {
  sr?: string;
  clinicId?: number;
  doctorId?: number;
  patientName?: string;
  patientPhone?: string;
  date: string;
  time: string;
  durationMinutes?: number;
  consentMedicalRecords: boolean;
  consentWhatsapp: boolean;
}

export interface BookingResult {
  appointmentId: number;
  pendingRegistration: boolean;
  message?: string;
}

export interface CompleteRegistrationRequest {
  token: string;
  email: string;
  password: string;
  name?: string;
  lastname?: string;
}

export interface PatientLoginResponse {
  id: number;
  name: string;
  lastname: string;
  email: string;
  token: string;
  phone?: string;
}

export interface TimeSlot {
  date: string;
  time: string;
  isAvailable: boolean;
}

export interface BookingLinkResponse {
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPublicAvailability(
    sr: string,
    clinicId: number,
    doctorId: number,
    date: string
  ): Observable<TimeSlot[]> {
    let url = `${this.baseUrl}/booking/availability?sr=${encodeURIComponent(sr)}&date=${date}`;
    if (clinicId) url += `&clinicId=${clinicId}`;
    if (doctorId) url += `&doctorId=${doctorId}`;
    return this.http.get<TimeSlot[]>(url);
  }

  completeBooking(request: BookingCompleteRequest): Observable<BookingResult> {
    return this.http.post<BookingResult>(
      `${this.baseUrl}/booking/complete`,
      request
    );
  }

  completeRegistration(
    request: CompleteRegistrationRequest
  ): Observable<PatientLoginResponse> {
    return this.http.post<PatientLoginResponse>(
      `${this.baseUrl}/booking/registration/complete`,
      request
    );
  }

  resendRegistration(phone: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/booking/registration/resend`,
      { phone }
    );
  }

  generateStaffLink(
    clinicId: number,
    doctorId: number
  ): Observable<BookingLinkResponse> {
    return this.http.post<BookingLinkResponse>(
      `${this.baseUrl}/booking/staff/link`,
      { clinicId, doctorId }
    );
  }
}
