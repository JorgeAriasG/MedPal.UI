export interface IAnthropometry {
  id?: number;
  patientDetailsId: number;
  recordedAt: Date;
  weight: number;
  height: number;
  bmi: number;

  waist?: number;
  hip?: number;
  waistHipRatio?: number;
  waistHeightRatio?: number;
  neck?: number;
  midArmCircumference?: number;
  wrist?: number;
  calf?: number;
  thigh?: number;
  shoulderBreadth?: number;
  chest?: number;
  forearm?: number;

  tricepsSkinfold?: number;
  bicepsSkinfold?: number;
  subscapularSkinfold?: number;
  suprailiacSkinfold?: number;
  calfSkinfold?: number;
  thighSkinfold?: number;
  abdominalSkinfold?: number;
  pectoralSkinfold?: number;
  axillarySkinfold?: number;

  bodyFatPercentageEstimated?: number;

  notes?: string;
  createdAt?: Date;
}

export interface IAnthropometryHistory {
  entries: IAnthropometry[];
}

export type SkinfoldMethod = 'durnin-womersley' | 'jackson-pollock-3' | 'jackson-pollock-7';

export interface ISkinfoldCalculation {
  bodyDensity: number;
  bodyFatPercentage: number;
  method: SkinfoldMethod;
}
