import { SpecialtyType } from 'src/app/entities/specialty-templates.model';

export interface SoapConfig {
  usesSoap: boolean;
  usesCie10: boolean;
  template: 'dental' | 'nutrition' | 'soap' | 'generic';
  label: string;
}

export const SPECIALTY_CONFIG: Record<SpecialtyType, SoapConfig> = {
  General: {
    usesSoap: true,
    usesCie10: true,
    template: 'soap',
    label: 'Medicina General',
  },
  Cardiology: {
    usesSoap: true,
    usesCie10: true,
    template: 'soap',
    label: 'Cardiolog��a',
  },
  Pediatrics: {
    usesSoap: true,
    usesCie10: true,
    template: 'soap',
    label: 'Pediatr��a',
  },
  Dermatology: {
    usesSoap: true,
    usesCie10: true,
    template: 'soap',
    label: 'Dermatolog��a',
  },
  Dental: {
    usesSoap: false,
    usesCie10: false,
    template: 'dental',
    label: 'Odontolog��a',
  },
  Nutrition: {
    usesSoap: false,
    usesCie10: false,
    template: 'nutrition',
    label: 'Nutrici��n',
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
