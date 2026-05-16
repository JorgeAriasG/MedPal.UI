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
  Cardiología: {
    usesSoap: true,
    usesCie10: true,
    template: 'soap',
    label: 'Cardiología',
  },
  Pediatría: {
    usesSoap: true,
    usesCie10: true,
    template: 'soap',
    label: 'Pediatría',
  },
  Dermatología: {
    usesSoap: true,
    usesCie10: true,
    template: 'soap',
    label: 'Dermatología',
  },
  Dental: {
    usesSoap: false,
    usesCie10: false,
    template: 'dental',
    label: 'Odontología',
  },
  'Nutrición': {
    usesSoap: false,
    usesCie10: false,
    template: 'nutrition',
    label: 'Nutrición',
  },
};
