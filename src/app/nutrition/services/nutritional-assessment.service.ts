import { Injectable } from '@angular/core';
import {
  INutritionalAssessment,
  BmrMethod,
  ActivityFactor,
  AssessmentGoal,
  ACTIVITY_FACTOR_VALUES,
  GOAL_ADJUSTMENT,
} from '../models';

@Injectable({ providedIn: 'root' })
export class NutritionalAssessmentService {

  calculateBMR(
    weight: number,
    height: number,
    age: number,
    gender: 'male' | 'female',
    method: BmrMethod = 'mifflin-st-jeor'
  ): number {
    switch (method) {
      case 'mifflin-st-jeor': {
        const base = 10 * weight + 6.25 * height * 100 - 5 * age;
        return gender === 'male' ? Math.round(base + 5) : Math.round(base - 161);
      }
      case 'harris-benedict': {
        const base = 13.397 * weight + 4.799 * height * 100 - 5.677 * age;
        return gender === 'male'
          ? Math.round(base + 88.362)
          : Math.round(9.247 * weight + 3.098 * height * 100 - 4.33 * age + 447.593);
      }
      case 'world-health-org': {
        return gender === 'male'
          ? Math.round(11.3 * weight + 16 * height * 100 + 901)
          : Math.round(8.7 * weight + 25 * height * 100 + 865);
      }
    }
  }

  calculateTEE(bmr: number, activityFactor: ActivityFactor): number {
    return Math.round(bmr * ACTIVITY_FACTOR_VALUES[activityFactor]);
  }

  calculateMacros(
    tee: number,
    goal: AssessmentGoal,
    weight: number
  ): { proteinTargetGrams: number; carbsTargetGrams: number; fatTargetGrams: number; proteinTargetPercentage: number; carbsTargetPercentage: number; fatTargetPercentage: number } {
    const adjustedCalories = tee + GOAL_ADJUSTMENT[goal];

    const proteinGrams = Math.round(weight * 1.8);
    const proteinCals = proteinGrams * 4;
    const proteinPercentage = Math.round((proteinCals / adjustedCalories) * 100);

    const fatGrams = Math.round(weight * 0.8);
    const fatCals = fatGrams * 9;
    const fatPercentage = Math.round((fatCals / adjustedCalories) * 100);

    const carbsCals = adjustedCalories - proteinCals - fatCals;
    const carbsGrams = Math.round(carbsCals / 4);
    const carbsPercentage = 100 - proteinPercentage - fatPercentage;

    return {
      proteinTargetGrams: proteinGrams,
      carbsTargetGrams: carbsGrams,
      fatTargetGrams: fatGrams,
      proteinTargetPercentage: proteinPercentage,
      carbsTargetPercentage: carbsPercentage,
      fatTargetPercentage: fatPercentage
    };
  }

  calculateWater(weight: number): number {
    return Math.round(weight * 35);
  }

  calculateFiber(calories: number): number {
    return Math.round(calories / 1000 * 14);
  }

  runFullAssessment(
    weight: number,
    height: number,
    age: number,
    gender: 'male' | 'female',
    activityFactor: ActivityFactor,
    goal: AssessmentGoal,
    method: BmrMethod = 'mifflin-st-jeor'
  ): INutritionalAssessment {
    const bmr = this.calculateBMR(weight, height, age, gender, method);
    const totalEnergyExpenditure = this.calculateTEE(bmr, activityFactor);
    const macros = this.calculateMacros(totalEnergyExpenditure, goal, weight);
    const waterTargetMl = this.calculateWater(weight);
    const fiberTargetGrams = this.calculateFiber(totalEnergyExpenditure);

    return {
      patientDetailsId: 0,
      recordedAt: new Date(),
      bmr,
      bmrMethod: method,
      totalEnergyExpenditure,
      activityFactor,
      goal,
      goalCalorieAdjustment: GOAL_ADJUSTMENT[goal],
      weight,
      height,
      age,
      gender,
      ...macros,
      waterTargetMl,
      fiberTargetGrams,
    };
  }
}
