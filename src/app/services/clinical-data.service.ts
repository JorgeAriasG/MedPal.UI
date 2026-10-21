import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { IVitalSign, IVitalSignWrite } from 'src/app/entities/IVitalSign';

@Injectable({ providedIn: 'root' })
export class ClinicalDataService {
  private antecedentsEndpoint = 'patientdetails';
  private vitalSignsEndpoint = 'vitalsign';

  constructor(private apiService: ApiService) {}

  getAntecedents(patientDetailsId: number): Observable<string | null> {
    return new Observable(observer => {
      this.apiService.get<any>(`${this.antecedentsEndpoint}/${patientDetailsId}`)
        .subscribe({
          next: (res) => {
            observer.next(res?.antecedentsData || null);
            observer.complete();
          },
          error: () => {
            observer.next(null);
            observer.complete();
          },
        });
    });
  }

  updateAntecedents(patientDetailsId: number, antecedentsData: string): Observable<any> {
    return this.apiService.put(`${this.antecedentsEndpoint}/${patientDetailsId}`, {
      patientId: null,
      antecedentsData,
    });
  }

  getVitalSigns(patientDetailsId: number): Observable<IVitalSign[]> {
    return this.apiService.get<IVitalSign[]>(`${this.vitalSignsEndpoint}/patientdetails/${patientDetailsId}`);
  }

  createVitalSign(data: IVitalSignWrite): Observable<IVitalSign> {
    return this.apiService.post<IVitalSign>(this.vitalSignsEndpoint, data);
  }

  updateVitalSign(id: number, data: IVitalSignWrite): Observable<any> {
    return this.apiService.put(`${this.vitalSignsEndpoint}/${id}`, data);
  }

  deleteVitalSign(id: number): Observable<any> {
    return this.apiService.delete(`${this.vitalSignsEndpoint}/${id}`);
  }
}
