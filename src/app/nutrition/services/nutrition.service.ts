import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import {
  IBodyComposition,
  IAnthropometry,
  IDietPlan,
  INutritionProgress,
  INutritionalAssessment,
  ISupplement,
  IFoodItem,
  IMeal,
  IMealItem,
} from '../models';

@Injectable({ providedIn: 'root' })
export class NutritionService {
  private base = 'nutrition';

  constructor(private api: ApiService) {}

  // ==================== BODY COMPOSITION ====================

  getBodyComposition(patientDetailsId: number): Observable<IBodyComposition[]> {
    return this.api.get<any[]>(`${this.base}/body-composition/${patientDetailsId}`)
      .pipe(map(records => records.map(r => this.mapBodyComposition(r))));
  }

  getLatestBodyComposition(patientDetailsId: number): Observable<IBodyComposition | null> {
    return this.api.get<any>(`${this.base}/body-composition/latest/${patientDetailsId}`)
      .pipe(map(r => r ? this.mapBodyComposition(r) : null));
  }

  saveBodyComposition(data: IBodyComposition): Observable<IBodyComposition> {
    const payload = this.toBodyCompositionPayload(data);
    return this.api.post<any>(`${this.base}/body-composition`, payload)
      .pipe(map(r => this.mapBodyComposition(r)));
  }

  updateBodyComposition(id: number, data: IBodyComposition): Observable<void> {
    const payload = this.toBodyCompositionPayload(data);
    return this.api.put<void>(`${this.base}/body-composition/${id}`, payload);
  }

  deleteBodyComposition(id: number): Observable<void> {
    return this.api.delete<void>(`${this.base}/body-composition/${id}`);
  }

  // ==================== FOOD CATALOG ====================

  getAllFoods(): Observable<IFoodItem[]> {
    return this.api.get<IFoodItem[]>(`${this.base}/food`);
  }

  searchFoods(query: string): Observable<IFoodItem[]> {
    return this.api.get<IFoodItem[]>(`${this.base}/food/search`, { params: { q: query } });
  }

  getFoodCategories(): Observable<string[]> {
    return this.api.get<string[]>(`${this.base}/food/categories`);
  }

  getFoodByCategory(category: string): Observable<IFoodItem[]> {
    return this.api.get<IFoodItem[]>(`${this.base}/food/category/${category}`);
  }

  getFoodItem(id: number): Observable<IFoodItem> {
    return this.api.get<IFoodItem>(`${this.base}/food/${id}`);
  }

  // ==================== ANTHROPOMETRY ====================

  getAnthropometry(patientDetailsId: number): Observable<IAnthropometry[]> {
    return this.api.get<IAnthropometry[]>(`${this.base}/anthropometry/${patientDetailsId}`);
  }

  saveAnthropometry(data: IAnthropometry): Observable<IAnthropometry> {
    return this.api.post<IAnthropometry>(`${this.base}/anthropometry`, data);
  }

  updateAnthropometry(id: number, data: IAnthropometry): Observable<IAnthropometry> {
    return this.api.put<IAnthropometry>(`${this.base}/anthropometry/${id}`, data);
  }

  deleteAnthropometry(id: number): Observable<void> {
    return this.api.delete<void>(`${this.base}/anthropometry/${id}`);
  }

  // ==================== DIET PLANS ====================

  getDietPlans(patientDetailsId: number): Observable<IDietPlan[]> {
    return this.api.get<IDietPlan[]>(`${this.base}/diet-plans/${patientDetailsId}`);
  }

  getDietPlan(id: number): Observable<IDietPlan> {
    return this.api.get<IDietPlan>(`${this.base}/diet-plans/detail/${id}`);
  }

  saveDietPlan(data: IDietPlan): Observable<IDietPlan> {
    return this.api.post<IDietPlan>(`${this.base}/diet-plans`, data);
  }

  updateDietPlan(id: number, data: IDietPlan): Observable<IDietPlan> {
    return this.api.put<IDietPlan>(`${this.base}/diet-plans/${id}`, data);
  }

  updateDietPlanStatus(id: number, status: string): Observable<void> {
    return this.api.patch<void>(`${this.base}/diet-plans/${id}/status`, { status });
  }

  deleteDietPlan(id: number): Observable<void> {
    return this.api.delete<void>(`${this.base}/diet-plans/${id}`);
  }

  // ==================== NUTRITION PROGRESS ====================

  getProgress(patientDetailsId: number): Observable<INutritionProgress[]> {
    return this.api.get<INutritionProgress[]>(`${this.base}/progress/${patientDetailsId}`);
  }

  saveProgress(data: INutritionProgress): Observable<INutritionProgress> {
    return this.api.post<INutritionProgress>(`${this.base}/progress`, data);
  }

  deleteProgress(id: number): Observable<void> {
    return this.api.delete<void>(`${this.base}/progress/${id}`);
  }

  // ==================== ASSESSMENT ====================

  getAssessment(patientDetailsId: number): Observable<INutritionalAssessment> {
    return this.api.get<INutritionalAssessment>(`${this.base}/assessment/${patientDetailsId}`);
  }

  // ==================== SUPPLEMENTS ====================

  getSupplements(patientDetailsId: number): Observable<ISupplement[]> {
    return this.api.get<ISupplement[]>(`${this.base}/supplements/${patientDetailsId}`);
  }

  saveSupplement(data: ISupplement): Observable<ISupplement> {
    return this.api.post<ISupplement>(`${this.base}/supplements`, data);
  }

  updateSupplement(id: number, data: ISupplement): Observable<ISupplement> {
    return this.api.put<ISupplement>(`${this.base}/supplements/${id}`, data);
  }

  deleteSupplement(id: number): Observable<void> {
    return this.api.delete<void>(`${this.base}/supplements/${id}`);
  }

  // ==================== INBODY SYNC ====================

  syncInBody(patientDetailsId: number, rawData: string): Observable<any> {
    return this.api.post<any>(`${this.base}/inbody/sync`, {
      patientDetailsId,
      rawData,
      recordedAt: new Date().toISOString(),
    });
  }

  // ==================== MAPPING HELPERS ====================

  private mapBodyComposition(dto: any): IBodyComposition {
    return {
      id: dto.id,
      patientDetailsId: dto.patientDetailsId,
      recordedAt: dto.recordedAt,
      weight: dto.weight,
      height: dto.height,
      bmi: dto.bmi,
      muscleMass: dto.muscleMass,
      bodyFatMass: dto.bodyFatMass,
      bodyFatPercentage: dto.bodyFatPercentage,
      totalBodyWater: dto.totalBodyWater,
      intracellularWater: dto.intracellularWater,
      extracellularWater: dto.extracellularWater,
      ecwTbwRatio: dto.ecwTbwRatio,
      proteinMass: dto.proteinMass,
      minerals: dto.minerals,
      visceralFat: dto.visceralFat,
      phaseAngle: dto.phaseAngle,
      basalMetabolicRate: dto.bmr,
      boneMass: dto.boneMass,
      metabolicAge: dto.metabolicAge,
      waistHipRatio: dto.waistHipRatio,
      bodyWaterPercentage: dto.bodyWaterPercentage,
      bmr: dto.bmr,
      segmentalLean: {
        rightArm: dto.segmentalLeanRightArm,
        leftArm: dto.segmentalLeanLeftArm,
        trunk: dto.segmentalLeanTrunk,
        rightLeg: dto.segmentalLeanRightLeg,
        leftLeg: dto.segmentalLeanLeftLeg,
      },
      segmentalLeanRightArm: dto.segmentalLeanRightArm,
      segmentalLeanLeftArm: dto.segmentalLeanLeftArm,
      segmentalLeanTrunk: dto.segmentalLeanTrunk,
      segmentalLeanRightLeg: dto.segmentalLeanRightLeg,
      segmentalLeanLeftLeg: dto.segmentalLeanLeftLeg,
      source: dto.source,
      inbodyResultId: dto.inbodyResultId,
      bwImported: dto.bwImported,
      notes: dto.notes,
      createdAt: dto.createdAt,
    };
  }

  private toBodyCompositionPayload(data: IBodyComposition): any {
    return {
      patientDetailsId: data.patientDetailsId,
      recordedAt: data.recordedAt,
      weight: data.weight,
      height: data.height,
      bodyFatPercentage: data.bodyFatPercentage,
      muscleMass: data.muscleMass,
      bodyFatMass: data.bodyFatMass,
      totalBodyWater: data.totalBodyWater,
      intracellularWater: data.intracellularWater,
      extracellularWater: data.extracellularWater,
      ecwTbwRatio: data.ecwTbwRatio,
      proteinMass: data.proteinMass,
      minerals: data.minerals,
      visceralFat: data.visceralFat,
      phaseAngle: data.phaseAngle,
      bmr: data.basalMetabolicRate,
      boneMass: data.boneMass,
      metabolicAge: data.metabolicAge,
      waistHipRatio: data.waistHipRatio,
      bodyWaterPercentage: data.bodyWaterPercentage,
      segmentalLeanRightArm: data.segmentalLean?.rightArm,
      segmentalLeanLeftArm: data.segmentalLean?.leftArm,
      segmentalLeanTrunk: data.segmentalLean?.trunk,
      segmentalLeanRightLeg: data.segmentalLean?.rightLeg,
      segmentalLeanLeftLeg: data.segmentalLean?.leftLeg,
      source: data.source,
      inbodyResultId: data.inbodyResultId,
      bwImported: data.bwImported,
      notes: data.notes,
    };
  }
}
