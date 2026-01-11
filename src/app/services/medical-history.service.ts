import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  MedicalHistoryReadDTO,
  MedicalHistoryWriteDTO,
} from '../entities/medical-history.model';
import { SpecialtyDataType } from '../entities/specialty-templates.model';

@Injectable({
  providedIn: 'root',
})
export class MedicalHistoryService {
  private endpoint = 'medicalhistory';

  constructor(private apiService: ApiService) {}

  /**
   * Create a new medical history entry
   */
  createHistory(
    data: MedicalHistoryWriteDTO
  ): Observable<MedicalHistoryReadDTO> {
    return this.apiService.post<MedicalHistoryReadDTO>(this.endpoint, data);
  }

  /**
   * Get medical history for a specific patient
   * Note: This is included in the PatientDetails endpoint
   */
  getPatientHistory(patientId: number): Observable<MedicalHistoryReadDTO[]> {
    // This would typically come from the PatientDetails endpoint
    // For now, we'll use a dedicated endpoint if available
    return this.apiService.get<MedicalHistoryReadDTO[]>(
      `${this.endpoint}/patient/${patientId}`
    );
  }

  /**
   * Serialize specialty data to JSON string
   */
  serializeSpecialtyData(data: SpecialtyDataType): string {
    try {
      return JSON.stringify(data);
    } catch (error) {
      console.error('Error serializing specialty data:', error);
      return '{}';
    }
  }

  /**
   * Parse specialty data from JSON string
   */
  parseSpecialtyData<T>(json: string): T | null {
    try {
      if (!json || json.trim() === '') {
        return null;
      }
      return JSON.parse(json) as T;
    } catch (error) {
      console.error('Error parsing specialty data:', error);
      return null;
    }
  }
}
