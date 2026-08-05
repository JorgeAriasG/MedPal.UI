import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPatient } from 'src/app/entities/IPatient';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class PatientsService {
  private endpoint = 'patient';
  private patientDetailsEndpoint = 'patientdetails';

  constructor(private apiService: ApiService) {}

  getPatients(clinicId: number | null | undefined, search?: string, sortBy?: string, descending: boolean = false): Observable<any> {
    let url = `${this.endpoint}?clinicId=${clinicId}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (sortBy) url += `&sortBy=${sortBy}&descending=${descending}`;
    return this.apiService.get(url);
  }

  addPatient(patient: IPatient): Observable<any> {
    const url = `${this.endpoint}`;
    return this.apiService.post(url, patient);
  }

  editPatient(patient: Partial<IPatient>): Observable<any> {
    const url = `${this.endpoint}/${patient.id}`;
    return this.apiService.put(url, patient);
  }

  deletePatient(id: number) {
    const url = `${this.endpoint}/${id}`;
    return this.apiService.delete(url);
  }

  getPatientDetails(id: number): Observable<any> {
    const url = `${this.patientDetailsEndpoint}/patient/${id}`; // Assuming endpoint pattern
    return this.apiService.get(url);
  }

  getPatientDetailsSummary(patientId: number): Observable<any> {
    const url = `${this.patientDetailsEndpoint}/patient/${patientId}/summary`;
    return this.apiService.get(url);
  }

  updateMedicalHistory(history: any): Observable<any> {
    // ... code ...
    return this.apiService.post(`patient/history`, history);
  }

  checkEmail(email: string): Observable<boolean> {
    return this.apiService.get<boolean>(`${this.endpoint}/check-email?email=${encodeURIComponent(email)}`);
  }
}
