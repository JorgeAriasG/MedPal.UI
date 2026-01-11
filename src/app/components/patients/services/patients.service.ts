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

  getPatientDetails(id: number): Observable<any> {
    const url = `${this.patientDetailsEndpoint}/patient/${id}`; // Assuming endpoint pattern
    return this.apiService.get(url);
  }

  updateMedicalHistory(history: any): Observable<any> {
    // Based on requirement: "Agregar Nota Médica/Diagnóstico: Formulario para insertar en MedicalHistory"
    // Usually this is a POST to sub-resource or PUT to patient history
    // Assuming: POST /api/patient/history or PUT /api/patient/{id}/history
    // Let's assume a dedicated endpoint or updating the patient object.
    // Prompt said: "Consumir el endpoint que devuelve PatientDetails + MedicalHistory"
    // And "Agregar Nota... Backend ya cifra".
    // Let's try POST to 'medical-history' or similar.
    // To be safe and standard: POST to `patient/history`
    return this.apiService.post(`patient/history`, history);
  }
}
