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
    // Assuming QR returns an image blob, or a base64 string.
    // If it returns a strong URL or base64 wrapper, adjust accordingly.
    // Based on requirements, it's GET /api/Prescription/{id}/qr
    // Often these endpoints return the image directly.
    return this.apiService.get(`${this.endpoint}/${id}/qr`);
  }

  validatePrescription(uniqueCode: string): Observable<any> {
    return this.apiService.get(`${this.endpoint}/validate/${uniqueCode}`);
  }

  getPrescriptionsByPatient(patientId: number): Observable<IPrescription[]> {
    return this.apiService.get<IPrescription[]>(
      `${this.endpoint}/patient/${patientId}`
    );
  }
}
