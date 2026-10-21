export interface IDietPlan {
  id?: number;
  patientDetailsId: number;
  name: string;
  description?: string;
  objective?: string;

  dailyCalories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG?: number;
  waterMl?: number;

  meals: IMeal[];

  startDate: Date;
  endDate?: Date;
  status: DietPlanStatus;

  createdAt?: Date;
}

export type DietPlanStatus = 'Draft' | 'Active' | 'Completed' | 'Cancelled';

export interface IMeal {
  id?: number;
  mealName: string;
  mealOrder: number;
  timeOfDay?: string;
  items: IMealItem[];
  instructions?: string;
}

export interface IMealItem {
  foodItemId?: number;
  customFoodName?: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiberG?: number;
  notes?: string;
}

export interface IDietPlanTemplate {
  id: string;
  name: string;
  description: string;
  condition: string;
  dailyCalories: number;
  proteinPercentage: number;
  carbsPercentage: number;
  fatPercentage: number;
  meals: IMeal[];
  isDefault: boolean;
}
