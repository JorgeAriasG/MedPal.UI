import { SpecialtyType } from 'src/app/entities/specialty-templates.model';

export type SpecialtyBaseTab =
  | 'overview'
  | 'history'
  | 'antecedents'
  | 'vitals'
  | 'consents'
  | 'prescriptions';

export type SpecialtyModuleTab =
  | 'bodyComposition'
  | 'anthropometry'
  | 'assessment'
  | 'dietPlans'
  | 'supplements'
  | 'progress';

export interface SoapConfig {
  usesSoap: boolean;
  usesCie10: boolean;
  template: 'dental' | 'nutrition' | 'soap' | 'generic';
  label: string;
  /** Read-only reference tabs shown before the specialty tab. */
  tabs: SpecialtyBaseTab[];
  /** Extra data modules rendered as nested tabs inside the specialty tab. */
  modules: SpecialtyModuleTab[];
}

const BASE_TABS_GENERAL: SpecialtyBaseTab[] = [
  'overview',
  'history',
  'antecedents',
  'vitals',
  'consents',
  'prescriptions',
];

const BASE_TABS_DENTAL: SpecialtyBaseTab[] = [
  'overview',
  'history',
  'antecedents',
  'consents',
  'prescriptions',
];

const BASE_TABS_NUTRITION: SpecialtyBaseTab[] = [
  'overview',
  'history',
  'antecedents',
  'consents',
];

export const SPECIALTY_CONFIG: Record<SpecialtyType, SoapConfig> = {
  General: {
    usesSoap: true,
    usesCie10: true,
    template: 'soap',
    label: 'Medicina General',
    tabs: BASE_TABS_GENERAL,
    modules: [],
  },
  Cardiology: {
    usesSoap: true,
    usesCie10: true,
    template: 'soap',
    label: 'Cardiología',
    tabs: BASE_TABS_GENERAL,
    modules: [],
  },
  Pediatrics: {
    usesSoap: true,
    usesCie10: true,
    template: 'soap',
    label: 'Pediatría',
    tabs: BASE_TABS_GENERAL,
    modules: [],
  },
  Dermatology: {
    usesSoap: true,
    usesCie10: true,
    template: 'soap',
    label: 'Dermatología',
    tabs: BASE_TABS_GENERAL,
    modules: [],
  },
  Dental: {
    usesSoap: false,
    usesCie10: false,
    template: 'dental',
    label: 'Odontología',
    tabs: BASE_TABS_DENTAL,
    modules: [],
  },
  Nutrition: {
    usesSoap: false,
    usesCie10: false,
    template: 'nutrition',
    label: 'Nutrición',
    tabs: BASE_TABS_NUTRITION,
    modules: [
      'bodyComposition',
      'anthropometry',
      'assessment',
      'dietPlans',
      'supplements',
      'progress',
    ],
  },
};

const SPECIALTY_ALIASES: Record<string, SpecialtyType> = {
  general: 'General',
  'medicina general': 'General',
  cardiology: 'Cardiology',
  cardiologia: 'Cardiology',
  pediatrics: 'Pediatrics',
  pediatria: 'Pediatrics',
  dermatology: 'Dermatology',
  dermatologia: 'Dermatology',
  dental: 'Dental',
  odontologia: 'Dental',
  nutrition: 'Nutrition',
  nutricion: 'Nutrition',
};

function normalizeSpecialty(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export function resolveSpecialty(value: string | null | undefined): SpecialtyType {
  if (!value) return 'General';
  const key = normalizeSpecialty(value);
  return SPECIALTY_ALIASES[key] || 'General';
}