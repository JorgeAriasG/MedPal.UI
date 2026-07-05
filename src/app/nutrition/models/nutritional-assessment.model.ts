export interface INutritionalAssessment {
  id?: number;
  patientDetailsId: number;
  recordedAt: Date;

  bmr: number;
  bmrMethod: BmrMethod;

  totalEnergyExpenditure: number;
  estimatedDailyCalories?: number;
  activityFactor: ActivityFactor;

  proteinTargetGrams: number;
  carbsTargetGrams: number;
  fatTargetGrams: number;

  recommendedProteinG?: number;
  recommendedCarbsG?: number;
  recommendedFatG?: number;

  proteinTargetPercentage: number;
  carbsTargetPercentage: number;
  fatTargetPercentage: number;

  waterTargetMl: number;
  fiberTargetGrams: number;

  bmi?: number;
  bmiClassification?: string;
  bodyFatPercentage?: number;
  bodyFatClassification?: string;
  metabolicAge?: number;
  waistHipRatio?: number;
  whrClassification?: string;

  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female';

  goal: AssessmentGoal;
  goalCalorieAdjustment: number;

  createdAt?: Date;
}

export type BmrMethod = 'mifflin-st-jeor' | 'harris-benedict' | 'world-health-org';

export type ActivityFactor =
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'active'
  | 'very-active';

export type AssessmentGoal = 'weight-loss' | 'maintenance' | 'weight-gain' | 'muscle-gain';

export const ACTIVITY_FACTOR_VALUES: Record<ActivityFactor, number> = {
  'sedentary': 1.2,
  'light': 1.375,
  'moderate': 1.55,
  'active': 1.725,
  'very-active': 1.9,
};

export const GOAL_ADJUSTMENT: Record<AssessmentGoal, number> = {
  'weight-loss': -500,
  'maintenance': 0,
  'weight-gain': 300,
  'muscle-gain': 500,
};
