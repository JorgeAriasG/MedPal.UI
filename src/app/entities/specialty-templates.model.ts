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

export interface DentalData {
  teeth: {
    [toothNumber: string]: ToothData;
  };
  observations?: string;
}

export interface NutritionData {
  peso: number;
  altura: number;
  imc: number; // Calculated automatically
  objetivo: string;
  restricciones: string[];
  caloriasDiarias: number;
}

export interface GenericData {
  customData: string; // Free-form JSON or notes
}

// Union type for all specialty data
export type SpecialtyDataType = DentalData | NutritionData | GenericData;

// Specialty type enum
export type SpecialtyType = 'Dental' | 'Nutrición' | 'Cardiología' | 'General';
