import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IPatient } from 'src/app/entities/IPatient';
import { AuthState } from 'src/app/store/reducers/auth.reducer';

@Injectable({
  providedIn: 'root'
})
export class PatientsService {
  private baseUrl = 'http://localhost:5126/api/patient';

  constructor(private http: HttpClient) {
  }

  getPatients(): Observable<any> {
    const url = `${this.baseUrl}?clinicId=2`;
    return this.http.get(url);
  }

  savePatient(patient: IPatient): Observable<any> {
    const url = `${this.baseUrl}`;
    return this.http.post(url, patient);
  }

  editPatient(patient: Partial<IPatient>): Observable<any> {
    const url = `${this.baseUrl}/${patient.id}`;
    return this.http.put(url, patient);
  }

  deletePatient(id: number) {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete(url);
  }
}
