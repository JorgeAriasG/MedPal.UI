export interface ClinicalAttachmentDTO {
  id: number;
  medicalHistoryId: number;
  type: 'radio' | 'photo' | 'doc' | string;
  fileName: string;
  mimeType: string;
  size: number;
  uploadedByUserId?: number;
  createdAt: string | Date;
}
