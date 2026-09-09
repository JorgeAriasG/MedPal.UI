import {
  DentalClinicalAlert,
  DentalExplorationStatus,
  DentalExplorationSummary,
  DentalPeriodonciaTooth,
  DentalPeriodontalSurface,
  DentalSurface,
  DentalFinding,
} from 'src/app/entities/dental-exploration.model';

// Arcadas FDI (adulto, 32 piezas)
export const FDI_UPPER_TEETH = [
  '18', '17', '16', '15', '14', '13', '12', '11',
  '21', '22', '23', '24', '25', '26', '27', '28',
];

export const FDI_LOWER_TEETH = [
  '48', '47', '46', '45', '44', '43', '42', '41',
  '31', '32', '33', '34', '35', '36', '37', '38',
];

export const FDI_ALL_TEETH = [...FDI_UPPER_TEETH, ...FDI_LOWER_TEETH];

export interface DentalStatusOption {
  value: DentalExplorationStatus;
  labelKey: string;
  color: string;
  icon: string;
}

const STATUS_KEY = 'CONSULTATION_WORKSPACE.ODO_STATUS_';

export const DENTAL_STATUSES: DentalStatusOption[] = [
  { value: 'sano', labelKey: `${STATUS_KEY}SANO`, color: '#37b26c', icon: 'check_circle' },
  { value: 'caries', labelKey: `${STATUS_KEY}CARIES`, color: '#e5484d', icon: 'warning' },
  { value: 'restauracion', labelKey: `${STATUS_KEY}RESTAURACION`, color: '#2f7fd0', icon: 'build' },
  { value: 'corona', labelKey: `${STATUS_KEY}CORONA`, color: '#e2a61c', icon: 'star' },
  { value: 'ausente', labelKey: `${STATUS_KEY}AUSENTE`, color: '#9aa7b8', icon: 'block' },
  { value: 'extraccion', labelKey: `${STATUS_KEY}EXTRACCION`, color: '#b34beb', icon: 'highlight_off' },
  { value: 'implante', labelKey: `${STATUS_KEY}IMPLANTE`, color: '#0ea5a8', icon: 'anchor' },
  { value: 'fractura', labelKey: `${STATUS_KEY}FRACTURA`, color: '#f2994a', icon: 'report' },
  { value: 'conducto', labelKey: `${STATUS_KEY}CONDUCTO`, color: '#8e5ccf', icon: 'healing' },
  { value: 'sellador', labelKey: `${STATUS_KEY}SELLADOR`, color: '#46b5d6', icon: 'disc_full' },
  { value: 'protesis', labelKey: `${STATUS_KEY}PROTESIS`, color: '#78879b', icon: 'settings_input_component' },
];

const SURFACE_KEY = 'CONSULTATION_WORKSPACE.DENTAL_SURFACE_';

export const DENTAL_SURFACES: { value: DentalSurface; labelKey: string; short: string }[] = [
  { value: 'vestibular', labelKey: `${SURFACE_KEY}VESTIBULAR`, short: 'V' },
  { value: 'lingual', labelKey: `${SURFACE_KEY}LINGUAL`, short: 'L' },
  { value: 'mesial', labelKey: `${SURFACE_KEY}MESIAL`, short: 'M' },
  { value: 'distal', labelKey: `${SURFACE_KEY}DISTAL`, short: 'D' },
  { value: 'oclusal', labelKey: `${SURFACE_KEY}OCLUSAL`, short: 'O' },
];

export const PERIODONTAL_ROW_VESTIBULAR: DentalPeriodontalSurface[] = ['MV', 'V', 'DV'];
export const PERIODONTAL_ROW_PALATINO: DentalPeriodontalSurface[] = ['ML', 'L', 'DL'];

export function emptyPeriodonciaTooth(): DentalPeriodonciaTooth {
  return {
    profundidad: {},
    margenGingival: '',
    nivelInsercion: '',
    sangrado: false,
    supuracion: false,
    movilidad: '',
    furcacion: '',
  };
}

export function odontogramaTeeth(data: any): Record<string, DentalFinding> {
  const odonto = data?.odontograma;
  return odonto && odonto.teeth && typeof odonto.teeth === 'object' ? odonto.teeth : {};
}

export function findingFor(tooth: string, data: any): DentalFinding {
  const teeth = odontogramaTeeth(data);
  if (!teeth[tooth]) {
    teeth[tooth] = {};
  }
  return teeth[tooth];
}

export function isSurfaceSelected(surfaces: DentalSurface[] = [], surface: DentalSurface): boolean {
  return surfaces.includes(surface);
}

function periodonciaToothHasData(tooth: DentalPeriodonciaTooth): boolean {
  const depths = Object.values(tooth.profundidad || {}).some((v) => Number(v) > 0);
  return (
    depths ||
    !!tooth.margenGingival ||
    !!tooth.nivelInsercion ||
    !!tooth.sangrado ||
    !!tooth.supuracion ||
    !!tooth.movilidad ||
    !!tooth.furcacion
  );
}

export function computeExplorationSummary(data: any): DentalExplorationSummary {
  const teeth = odontogramaTeeth(data);
  let evaluated = 0;
  let findings = 0;
  let caries = 0;
  let restauraciones = 0;
  let ausencias = 0;

  for (const tooth of FDI_ALL_TEETH) {
    const f = teeth[tooth];
    if (!f || !f.status) continue;
    evaluated++;
    if (f.status !== 'sano') findings++;
    if (f.status === 'caries') caries++;
    if (f.status === 'restauracion') restauraciones++;
    if (f.status === 'ausente') ausencias++;
  }

  const perioDientes = data?.periodoncia?.dientes || {};
  const periodontales = Object.keys(perioDientes).filter((k) =>
    periodonciaToothHasData(perioDientes[k])
  ).length;

  return { evaluated, findings, caries, restauraciones, ausencias, periodontales };
}

export function computeClinicalAlerts(data: any): DentalClinicalAlert[] {
  const alerts: DentalClinicalAlert[] = [];
  const teeth = odontogramaTeeth(data);

  for (const tooth of FDI_ALL_TEETH) {
    const status = teeth[tooth]?.status;
    if (status === 'caries') {
      alerts.push({ key: 'CONSULTATION_WORKSPACE.PANEL_ALERT_CARIES', params: { tooth } });
    } else if (status === 'extraccion') {
      alerts.push({ key: 'CONSULTATION_WORKSPACE.PANEL_ALERT_EXTRACCION', params: { tooth } });
    } else if (status === 'fractura') {
      alerts.push({ key: 'CONSULTATION_WORKSPACE.PANEL_ALERT_FRACTURA', params: { tooth } });
    } else if (status === 'conducto') {
      alerts.push({ key: 'CONSULTATION_WORKSPACE.PANEL_ALERT_CONDUCTO', params: { tooth } });
    } else if (status === 'protesis' || status === 'implante') {
      alerts.push({ key: 'CONSULTATION_WORKSPACE.PANEL_ALERT_PROTESIS', params: { tooth } });
    }
  }

  const perioDientes = data?.periodoncia?.dientes || {};
  const bleeding = Object.keys(perioDientes).some((k) => periodonciaToothHasData(perioDientes[k]) && perioDientes[k].sangrado);
  if (bleeding) {
    alerts.push({ key: 'CONSULTATION_WORKSPACE.PANEL_ALERT_SANGRADO' });
  }
  const supuracionTooth = Object.keys(perioDientes).find(
    (k) => perioDientes[k].supuracion
  );
  if (supuracionTooth) {
    alerts.push({
      key: 'CONSULTATION_WORKSPACE.PANEL_ALERT_SUPURACION',
      params: { tooth: supuracionTooth },
    });
  }
  const placa = Number(data?.periodoncia?.indicePlaca) || 0;
  if (placa >= 30) {
    alerts.push({ key: 'CONSULTATION_WORKSPACE.PANEL_ALERT_PLACA' });
  }

  return alerts;
}

const STATUS_LABEL: Record<DentalExplorationStatus, string> = {
  sano: 'sano',
  caries: 'caries',
  restauracion: 'restauración',
  corona: 'corona',
  ausente: 'ausente',
  extraccion: 'extracción indicada',
  implante: 'implante',
  fractura: 'fractura',
  conducto: 'tratamiento de conducto',
  sellador: 'sellador',
  protesis: 'prótesis',
};

const SURFACE_LABEL: Record<DentalSurface, string> = {
  vestibular: 'vestibular',
  lingual: 'lingual',
  mesial: 'mesial',
  distal: 'distal',
  oclusal: 'oclusal',
};

/** Notas clínicas en texto plano (mismo estilo que buildNutritionClinicalNotes). */
export function buildDentalClinicalNotes(data: any): string {
  const lines: string[] = [];
  const teeth = odontogramaTeeth(data);

  const findings = FDI_ALL_TEETH
    .filter((tooth) => teeth[tooth]?.status && teeth[tooth]?.status !== 'sano')
    .map((tooth) => {
      const f = teeth[tooth] as DentalFinding;
      const surfaces = (f.surfaces || []).map((s) => SURFACE_LABEL[s]).join(', ');
      return `Pieza ${tooth}: ${STATUS_LABEL[f.status as DentalExplorationStatus]}${surfaces ? ` (${surfaces})` : ''}`;
    });
  if (findings.length) {
    lines.push(`Exploración: ${findings.join(' · ')}`);
  }

  const higiene = data?.notasClinicas?.higiene;
  if (higiene?.higiene) {
    lines.push(`Higiene oral: ${higiene.higiene}`);
    const extras = [higiene.placa, higiene.calculo, higiene.halitosis].filter(Boolean).join(', ');
    if (extras) lines.push(`Placa: ${extras}`);
  }

  const periodoncia = data?.periodoncia;
  if (periodoncia?.estado) {
    lines.push(`Estado periodontal: ${periodoncia.estado}`);
  }
  const placa = Number(periodoncia?.indicePlaca) || 0;
  const sangrado = Number(periodoncia?.sangradoSondaje) || 0;
  if (placa > 0 || sangrado > 0) {
    lines.push(`Índice de placa: ${placa}% · Sangrado al sondaje: ${sangrado}%`);
  }

  const imagenes = Array.isArray(data?.imagenes) ? data.imagenes : [];
  if (imagenes.length) {
    lines.push(`Imágenes clínicas: ${imagenes.length}`);
  }

  const hallazgos = data?.notasClinicas?.hallazgosGenerales;
  if (hallazgos) {
    lines.push(`Hallazgos generales: ${hallazgos}`);
  }

  return lines.join('\n');
}