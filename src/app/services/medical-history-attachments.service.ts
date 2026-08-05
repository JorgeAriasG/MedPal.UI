import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import { ClinicalAttachmentDTO } from 'src/app/entities/clinical-attachment.model';

@Injectable({
  providedIn: 'root',
})
export class MedicalHistoryAttachmentsService {
  private endpoint = 'medicalhistory';

  constructor(private apiService: ApiService) {}

  list(medicalHistoryId: number): Observable<ClinicalAttachmentDTO[]> {
    return this.apiService.get<ClinicalAttachmentDTO[]>(
      `${this.endpoint}/${medicalHistoryId}/attachments`
    );
  }

  upload(
    medicalHistoryId: number,
    file: File,
    type: string
  ): Observable<ClinicalAttachmentDTO> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('type', type);
    return this.apiService.post<ClinicalAttachmentDTO>(
      `${this.endpoint}/${medicalHistoryId}/attachments`,
      formData
    );
  }

  delete(id: number): Observable<any> {
    return this.apiService.delete(`attachments/${id}`);
  }

  contentUrl(id: number): string {
    return `${environment.apiUrl}attachments/${id}/content`;
  }

  getContentBlob(id: number): Observable<Blob> {
    return this.apiService.getBlob(`attachments/${id}/content`);
  }
}
