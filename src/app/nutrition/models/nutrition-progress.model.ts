export interface INutritionProgress {
  id?: number;
  patientDetailsId: number;
  recordedAt: Date;
  weight: number;
  bodyFatPercentage?: number;
  muscleMass?: number;
  skeletalMuscleMass?: number;
  waist?: number;
  waistCircumference?: number;
  caloriesConsumed?: number;
  proteinConsumed?: number;
  carbsConsumed?: number;
  fatConsumed?: number;
  waterGlasses?: number;
  exerciseMinutes?: number;
  adherence?: number;
  observations?: string;
  dietPlanId?: number;
  notes?: string;
  photos?: IProgressPhoto[];
  createdAt?: Date;
}

export interface IProgressPhoto {
  id?: number;
  patientDetailsId: number;
  photoUrl: string;
  photoType: PhotoType;
  recordedAt: Date;
  notes?: string;
}

export type PhotoType =
  | 'front'
  | 'back'
  | 'side-left'
  | 'side-right'
  | 'custom';
