// Modelo del STEP 3 "Exploración" (Odontología).
// Vive en `specialtyData.odontograma`, `specialtyData.notasClinicas`,
// `specialtyData.imagenes` y `specialtyData.periodoncia`. NO reutiliza el
// `DentalData.teeth` legacy (status: ToothStatus) para mantener
// back-compatibilidad con registros previos.

export type DentalExplorationStatus =
  | 'sano'
  | 'caries'
  | 'restauracion'
  | 'corona'
  | 'ausente'
  | 'extraccion'
  | 'implante'
  | 'fractura'
  | 'conducto'
  | 'sellador'
  | 'protesis';

export type DentalSurface =
  | 'vestibular'
  | 'lingual'
  | 'mesial'
  | 'distal'
  | 'oclusal';

export interface DentalFinding {
  status?: DentalExplorationStatus;
  surfaces?: DentalSurface[];
  observations?: string;
}

export interface DentalOdontograma {
  teeth: Record<string, DentalFinding>;
}

export interface DentalSoftTissue {
  estado: string;
  observaciones?: string;
}

export interface DentalHigiene {
  higiene: string;
  placa: string;
  calculo: string;
  halitosis: string;
}

export interface DentalOclusion {
  mordida: string;
  claseAngle: string;
  overbite: number | null;
  overjet: number | null;
  bruxismo: string;
  atm: string[];
}

export interface DentalNotasClinicas {
  tejidosBlandos: Record<string, DentalSoftTissue>;
  oclusion: DentalOclusion;
  higiene: DentalHigiene;
  hallazgosGenerales?: string;
}

export interface DentalImage {
  id: string;
  type: string;
  date: string;
  tooth?: string;
  description?: string;
  objectUrl?: string;
  name?: string;
  size?: number;
  mimeType?: string;
  file?: File;
}

export type DentalPeriodontalSurface = 'MV' | 'V' | 'DV' | 'ML' | 'L' | 'DL';

export interface DentalPeriodonciaTooth {
  profundidad: Partial<Record<DentalPeriodontalSurface, number>>;
  margenGingival: string;
  nivelInsercion: string;
  sangrado: boolean;
  supuracion: boolean;
  movilidad: string;
  furcacion: string;
}

export interface DentalPeriodoncia {
  estado: string;
  indicePlaca: number | null;
  sangradoSondaje: number | null;
  dientes: Record<string, DentalPeriodonciaTooth>;
}

export interface DentalExplorationSummary {
  evaluated: number;
  findings: number;
  caries: number;
  restauraciones: number;
  ausencias: number;
  periodontales: number;
}

export interface DentalClinicalAlert {
  key: string;
  params?: Record<string, unknown>;
}