// Specialty-specific data interfaces

export type ToothStatus =
  | 'sano'
  | 'caries'
  | 'resina'
  | 'corona'
  | 'ausente'
  | 'endodoncia';

export interface ToothData {
  status: ToothStatus;
  notes?: string;
}

// Shared "consultation engine" fields. Optional so all specialty data shapes
// remain backward-compatible (history-form, drafts, legacy records).
export interface ConsultationEngineFields {
  diagnosis?: string;
  clinicalNotes?: string;
  cie10Codes?: string; // JSON array string: '["I10","E11.9"]'
  treatments?: TreatmentItem[];
  measurements?: MeasurementData;
  attachments?: PendingAttachment[];
}

export interface DentalData extends ConsultationEngineFields {
  teeth: {
    [toothNumber: string]: ToothData;
  };
  observations?: string;
}

export interface NutritionData extends ConsultationEngineFields {
  peso: number;
  altura: number;
  imc: number; // Calculated automatically
  objetivo: string;
  restricciones: string[];
  caloriasDiarias: number;
}

export interface GenericData extends ConsultationEngineFields {
  customData: string; // Free-form JSON or notes
}

// Shared measurement data (un solo origen para peso/altura/IMC)
export interface MeasurementData {
  weight: number;
  height: number;
  bmi: number;
}

// Shared treatment/procedure item
export interface TreatmentItem {
  name: string;
  description?: string;
  dose?: string;
  frequency?: string;
  duration?: string;
}

// Pending clinical attachment before it is uploaded to the backend
export interface PendingAttachment {
  id: string; // temp id
  name: string;
  size: number;
  type: 'radio' | 'photo' | 'doc';
  mimeType: string;
  file?: File; // present only before upload (no se serializa en drafts)
  objectUrl?: string; // preview
}

// Union type for all specialty data
export type SpecialtyDataType = DentalData | NutritionData | GenericData;

// Specialty type enum
export type SpecialtyType = 'Dental' | 'Nutrition' | 'Cardiology' | 'General' | 'Pediatrics' | 'Dermatology';
