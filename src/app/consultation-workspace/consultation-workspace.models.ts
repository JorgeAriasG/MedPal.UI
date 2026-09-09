import { InjectionToken, Type } from '@angular/core';
import { SpecialtyType } from 'src/app/entities/specialty-templates.model';
import { IPatientDetail } from 'src/app/entities/IMedicalHistory';
import { MedicalHistoryReadDTO } from 'src/app/entities/medical-history.model';
import { IPrescription } from 'src/app/entities/IPrescription';

export interface ConsultationStepConfig {
  key: string;
  labelKey: string;
  icon: string;
  /** Optional component rendered inside the step content area. */
  component?: Type<any>;
  /** Steps that can be skipped without blocking navigation. */
  optional?: boolean;
}

export interface SpecialtyWorkspaceConfig {
  specialty: SpecialtyType;
  title: string;
  subtitleKey: string;
  steps: ConsultationStepConfig[];
  /** i18n label keys shown in the contextual panel. */
  objectives: string[];
  deliverables: string[];
}

/** Read-only patient/consultation context shared by every step. */
export interface ConsultationWorkspaceContext {
  patientDetailsId: number | null;
  patient: IPatientDetail | null;
  medicalHistory: MedicalHistoryReadDTO[];
  prescriptions: IPrescription[];
  allergies: any[];
  antecedentsData: string | null;
  lastWeight: number;
  lastHeight: number;
  appointment: any;
}

/** Data+context handed to dynamically rendered step components. */
export interface ConsultationStepData {
  data: any;
  context: ConsultationWorkspaceContext | null;
}

export const CONSULTATION_STEP_DATA = new InjectionToken<ConsultationStepData>(
  'consultation_workspace.step_data'
);