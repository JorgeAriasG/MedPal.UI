import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  MedicalHistoryReadDTO,
  MedicalHistoryWriteDTO,
  MedicalHistorySummaryDTO,
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
   * Get a lightweight list of recent histories for the reference panel
   */
  getRecentHistory(
    patientDetailsId: number,
    take = 10
  ): Observable<MedicalHistorySummaryDTO[]> {
    return this.apiService.get<MedicalHistorySummaryDTO[]>(
      `${this.endpoint}/patient/${patientDetailsId}/recent?take=${take}`
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
      const parsed = JSON.parse(json);
      if (typeof parsed === 'object' && parsed !== null && Object.keys(parsed).length === 0) {
        return null;
      }
      return parsed as T;
    } catch (error) {
      console.error('Error parsing specialty data:', error);
      return null;
    }
  }
}
