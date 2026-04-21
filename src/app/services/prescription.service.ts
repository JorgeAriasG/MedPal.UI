import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { IPrescription } from '../entities/IPrescription';

@Injectable({
  providedIn: 'root',
})
export class PrescriptionService {
  private endpoint = 'Prescription';

  constructor(private apiService: ApiService) {}

  createPrescription(prescription: IPrescription): Observable<IPrescription> {
    return this.apiService.post<IPrescription>(this.endpoint, prescription);
  }

  getPrescriptionById(id: number): Observable<IPrescription> {
    return this.apiService.get<IPrescription>(`${this.endpoint}/${id}`);
  }

  getPrescriptionQr(id: number): Observable<Blob> {
    return this.apiService.getBlob(`${this.endpoint}/${id}/qr`);
  }

  validatePrescription(uniqueCode: string): Observable<any> {
    return this.apiService.get(`${this.endpoint}/validate/${uniqueCode}`);
  }

  getPrescriptionsByPatient(patientId: number): Observable<IPrescription[]> {
    return this.apiService.get<IPrescription[]>(
      `${this.endpoint}/patient/${patientId}`
    );
  }

  checkAllergies(patientId: number, medications: string[]): Observable<{ hasAllergies: boolean, matchingAllergies: string[] }> {
    return this.apiService.post<{ hasAllergies: boolean, matchingAllergies: string[] }>(
      `${this.endpoint}/check-allergies`, 
      { patientId, medicationNames: medications }
    );
  }
}
