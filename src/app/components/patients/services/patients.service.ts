import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPatient } from 'src/app/entities/IPatient';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class PatientsService {
  private endpoint = 'patient';

  constructor(private apiService: ApiService) {}

  getPatients(clinicId: number | null | undefined): Observable<any> {
    let url = `${this.endpoint}?clinicId=${clinicId}`;
    return this.apiService.get(url);
  }

  savePatient(patient: IPatient): Observable<any> {
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
}
