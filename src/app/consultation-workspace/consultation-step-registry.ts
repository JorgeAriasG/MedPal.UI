import { Type } from '@angular/core';
import { SpecialtyType } from 'src/app/entities/specialty-templates.model';
import { SPECIALTY_CONFIG } from 'src/app/config/specialty-config';
import {
  ConsultationStepConfig,
  SpecialtyWorkspaceConfig,
} from './consultation-workspace.models';
import { GeneralStepComponent } from './steps/general-step.component';
import { AntecedentsStepComponent } from './steps/antecedents-step.component';
import { EvaluationStepComponent } from './steps/evaluation-step.component';
import { DiagnosisStepComponent } from './steps/diagnosis-step.component';
import { PlanStepComponent } from './steps/plan-step.component';
import { SummaryStepComponent } from './steps/summary-step.component';
import { NutritionAnamnesisStepComponent } from './steps/nutrition-anamnesis-step.component';
import { NutritionAnthropometryStepComponent } from './steps/nutrition-anthropometry-step.component';

const GENERAL = 'CONSULTATION_WORKSPACE.STEP_';

const BASE_STEPS: ConsultationStepConfig[] = [
  { key: 'general', labelKey: `${GENERAL}GENERAL`, icon: 'badge' },
  { key: 'antecedents', labelKey: `${GENERAL}ANTECEDENTS`, icon: 'history' },
  { key: 'evaluation', labelKey: `${GENERAL}CURRENT_EVAL`, icon: 'health_and_safety' },
  { key: 'diagnosis', labelKey: `${GENERAL}DIAGNOSIS_IMPRESSION`, icon: 'assignment_turned_in' },
  { key: 'plan', labelKey: `${GENERAL}PLAN_TREATMENT`, icon: 'medication' },
  { key: 'summary', labelKey: `${GENERAL}SUMMARY`, icon: 'summarize' },
];

const NUTRITION_STEPS: ConsultationStepConfig[] = [
  { key: 'general', labelKey: `${GENERAL}GENERAL`, icon: 'badge' },
  { key: 'anamnesis', labelKey: `${GENERAL}ANAMNESIS`, icon: 'forum' },
  { key: 'anthropometry', labelKey: `${GENERAL}ANTHROPOMETRY`, icon: 'straighten' },
  { key: 'evaluation', labelKey: `${GENERAL}EVALUATION`, icon: 'calculate' },
  { key: 'diet-plan', labelKey: `${GENERAL}DIET_PLAN`, icon: 'restaurant_menu' },
  { key: 'summary', labelKey: `${GENERAL}SUMMARY`, icon: 'summarize' },
];

const CARDIOLOGY_STEPS: ConsultationStepConfig[] = [
  { key: 'general', labelKey: `${GENERAL}GENERAL`, icon: 'badge' },
  { key: 'history', labelKey: `${GENERAL}HISTORY`, icon: 'history' },
  { key: 'physical-exam', labelKey: `${GENERAL}PHYSICAL_EXAM`, icon: 'monitor_heart' },
  { key: 'studies', labelKey: `${GENERAL}STUDIES`, icon: 'biotech' },
  { key: 'diagnosis', labelKey: `${GENERAL}DIAGNOSIS`, icon: 'assignment_turned_in' },
  { key: 'treatment-plan', labelKey: `${GENERAL}TREATMENT_PLAN`, icon: 'medication' },
];

const PSYCHOLOGY_STEPS: ConsultationStepConfig[] = [
  { key: 'general', labelKey: `${GENERAL}GENERAL`, icon: 'badge' },
  { key: 'motive-context', labelKey: `${GENERAL}MOTIVE_CONTEXT`, icon: 'forum' },
  { key: 'evaluation', labelKey: `${GENERAL}EVALUATION`, icon: 'psychology' },
  { key: 'diagnosis', labelKey: `${GENERAL}DIAGNOSIS`, icon: 'assignment_turned_in' },
  { key: 'therapeutic-plan', labelKey: `${GENERAL}THERAPEUTIC_PLAN`, icon: 'psychology_alt' },
];

const DENTAL_STEPS: ConsultationStepConfig[] = [
  { key: 'general', labelKey: `${GENERAL}GENERAL`, icon: 'badge' },
  { key: 'exploration', labelKey: `${GENERAL}EXPLORATION`, icon: 'face' },
  { key: 'diagnosis', labelKey: `${GENERAL}DIAGNOSIS`, icon: 'assignment_turned_in' },
  { key: 'treatment', labelKey: `${GENERAL}TREATMENT`, icon: 'medical_services' },
  { key: 'summary', labelKey: `${GENERAL}SUMMARY`, icon: 'summarize' },
];

const PHYSICAL_THERAPY_STEPS: ConsultationStepConfig[] = [
  { key: 'general', labelKey: `${GENERAL}GENERAL`, icon: 'badge' },
  { key: 'functional-eval', labelKey: `${GENERAL}FUNCTIONAL_EVAL`, icon: 'accessibility_new' },
  { key: 'diagnosis', labelKey: `${GENERAL}DIAGNOSIS`, icon: 'assignment_turned_in' },
  { key: 'treatment-plan', labelKey: `${GENERAL}TREATMENT_PLAN`, icon: 'medication' },
  { key: 'follow-up', labelKey: `${GENERAL}FOLLOW_UP`, icon: 'update' },
];

const SUBTITLE_KEY = 'CONSULTATION_WORKSPACE.SUBTITLE_';

/**
 * Fase 2 mapping: assign the reusable base components to semantically
 * equivalent steps across specialties. Specialty-specific components arrive
 * in Fase 3.
 */
const STEP_COMPONENT_BY_KEY: Record<string, Type<any>> = {
  general: GeneralStepComponent,
  antecedents: AntecedentsStepComponent,
  history: AntecedentsStepComponent,
  anamnesis: AntecedentsStepComponent,
  'motive-context': AntecedentsStepComponent,
  anthropometry: GeneralStepComponent,
  'physical-exam': GeneralStepComponent,
  exploration: GeneralStepComponent,
  evaluation: EvaluationStepComponent,
  'current-eval': EvaluationStepComponent,
  'functional-eval': EvaluationStepComponent,
  studies: EvaluationStepComponent,
  'follow-up': EvaluationStepComponent,
  diagnosis: DiagnosisStepComponent,
  'diagnosis-impression': DiagnosisStepComponent,
  plan: PlanStepComponent,
  'treatment-plan': PlanStepComponent,
  'diet-plan': PlanStepComponent,
  'therapeutic-plan': PlanStepComponent,
  treatment: PlanStepComponent,
  summary: SummaryStepComponent,
};

const SPECIALTY_STEP_COMPONENTS: Record<
  SpecialtyType,
  Record<string, Type<any>>
> = {
  General: {},
  Cardiology: {},
  Pediatrics: {},
  Dermatology: {},
  Dental: {},
  Nutrition: {
    anamnesis: NutritionAnamnesisStepComponent,
    anthropometry: NutritionAnthropometryStepComponent,
  },
};

function buildConfig(
  specialty: SpecialtyType,
  subtitleKey: string,
  steps: ConsultationStepConfig[]
): SpecialtyWorkspaceConfig {
  const label = SPECIALTY_CONFIG[specialty]?.label || SPECIALTY_CONFIG.General.label;
  const specialtyOverrides = SPECIALTY_STEP_COMPONENTS[specialty] || {};
  return {
    specialty,
    title: label,
    subtitleKey,
    steps: steps.map((step) => ({
      ...step,
      component: specialtyOverrides[step.key] ?? STEP_COMPONENT_BY_KEY[step.key] ?? undefined,
    })),
  };
}

export const SPECIALTY_WORKSPACE_REGISTRY: Record<SpecialtyType, SpecialtyWorkspaceConfig> = {
  General: buildConfig('General', `${SUBTITLE_KEY}GENERAL`, BASE_STEPS),
  Cardiology: buildConfig('Cardiology', `${SUBTITLE_KEY}CARDIOLOGY`, CARDIOLOGY_STEPS),
  Pediatrics: buildConfig('Pediatrics', `${SUBTITLE_KEY}GENERAL`, BASE_STEPS),
  Dermatology: buildConfig('Dermatology', `${SUBTITLE_KEY}GENERAL`, BASE_STEPS),
  Dental: buildConfig('Dental', `${SUBTITLE_KEY}DENTAL`, DENTAL_STEPS),
  Nutrition: buildConfig('Nutrition', `${SUBTITLE_KEY}NUTRITION`, NUTRITION_STEPS),
};

export function resolveWorkspaceConfig(
  specialty: SpecialtyType | string | null | undefined
): SpecialtyWorkspaceConfig {
  const key = (specialty === undefined || specialty === null ? '' : specialty) as SpecialtyType;
  return (
    SPECIALTY_WORKSPACE_REGISTRY[key] ||
    SPECIALTY_WORKSPACE_REGISTRY.General
  );
}