export interface IFoodItem {
  id?: number;
  name: string;
  brand?: string;
  category: FoodCategory;
  subcategory?: string;

  servingSize: number;
  servingUnit: string;

  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  saturatedFat?: number;
  transFat?: number;
  cholesterol?: number;
  sodium?: number;
  potassium?: number;

  vitaminA?: number;
  vitaminC?: number;
  calcium?: number;
  iron?: number;

  allergens?: string[];

  isSystemItem: boolean;
  isActive: boolean;
  createdByUserId?: number;

  createdAt?: Date;
}

export type FoodCategory =
  | 'dairy'
  | 'meat-poultry'
  | 'fish-seafood'
  | 'eggs'
  | 'legumes'
  | 'cereals-grains'
  | 'vegetables'
  | 'fruits'
  | 'nuts-seeds'
  | 'oils-fats'
  | 'sugars-sweets'
  | 'beverages'
  | 'condiments'
  | 'supplements'
  | 'prepared-meals';
