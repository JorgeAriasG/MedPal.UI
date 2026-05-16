import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { IPatientConsent } from 'src/app/entities/IPatientConsent';

@Injectable({ providedIn: 'root' })
export class ConsentService {
  private consentEndpoint = 'consent';

  constructor(private apiService: ApiService) {}

  getPatientConsents(patientDetailsId: number): Observable<IPatientConsent[]> {
    return this.apiService.get<IPatientConsent[]>(`${this.consentEndpoint}/patient/${patientDetailsId}`);
  }

  grantConsent(data: {
    patientDetailsId: number;
    requestingClinicId: number;
    ownerClinicId: number;
    consentScope: string;
    expiryDate?: Date;
  }): Observable<IPatientConsent> {
    return this.apiService.post<IPatientConsent>(`${this.consentEndpoint}/grant`, data);
  }

  revokeConsent(consentId: number): Observable<any> {
    return this.apiService.post(`${this.consentEndpoint}/${consentId}/revoke`, {});
  }
}
