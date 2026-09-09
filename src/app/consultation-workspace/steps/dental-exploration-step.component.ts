import { Component, Inject } from '@angular/core';
import {
  DentalClinicalAlert,
  DentalExplorationStatus,
  DentalExplorationSummary,
  DentalFinding,
  DentalImage,
  DentalNotasClinicas,
  DentalPeriodonciaTooth,
  DentalPeriodontalSurface,
  DentalSurface,
} from 'src/app/entities/dental-exploration.model';
import {
  DENTAL_STATUSES,
  DENTAL_SURFACES,
  FDI_LOWER_TEETH,
  FDI_UPPER_TEETH,
  PERIODONTAL_ROW_PALATINO,
  PERIODONTAL_ROW_VESTIBULAR,
  computeClinicalAlerts,
  computeExplorationSummary,
  emptyPeriodonciaTooth,
  findingFor,
} from './dental-exploration.utils';
import {
  CONSULTATION_STEP_DATA,
  ConsultationStepData,
} from '../consultation-workspace.models';

export type ExplorationTab = 'odontograma' | 'notas' | 'imagenes' | 'periodoncia';

interface ToothForm {
  status: DentalExplorationStatus;
  surfaces: DentalSurface[];
  observations: string;
}

const SOFT_TISSUE_ZONES: { key: string; labelKey: string }[] = [
  { key: 'labios', labelKey: 'CONSULTATION_WORKSPACE.NOTE_TJ_LABIOS' },
  { key: 'mucosa', labelKey: 'CONSULTATION_WORKSPACE.NOTE_TJ_MUCOSA' },
  { key: 'lengua', labelKey: 'CONSULTATION_WORKSPACE.NOTE_TJ_LENGUA' },
  { key: 'piso', labelKey: 'CONSULTATION_WORKSPACE.NOTE_TJ_PISO' },
  { key: 'paladar', labelKey: 'CONSULTATION_WORKSPACE.NOTE_TJ_PALADAR' },
  { key: 'orofaringe', labelKey: 'CONSULTATION_WORKSPACE.NOTE_TJ_OROFARINGE' },
];

@Component({
  selector: 'app-dental-exploration-step',
  templateUrl: './dental-exploration-step.component.html',
  styleUrls: ['./step-common.css', './dental-exploration-step.component.css'],
  standalone: false,
})
export class DentalExplorationStepComponent {
  data: any = {};

  tabs: { key: ExplorationTab; labelKey: string; icon: string }[] = [
    { key: 'odontograma', labelKey: 'CONSULTATION_WORKSPACE.EXPLO_TAB_ODONTOGRAMA', icon: 'grid_on' },
    { key: 'notas', labelKey: 'CONSULTATION_WORKSPACE.EXPLO_TAB_NOTAS', icon: 'edit_note' },
    { key: 'imagenes', labelKey: 'CONSULTATION_WORKSPACE.EXPLO_TAB_IMAGENES', icon: 'photo_library' },
    { key: 'periodoncia', labelKey: 'CONSULTATION_WORKSPACE.EXPLO_TAB_PERIODONCIA', icon: 'monitor_heart' },
  ];
  tab: ExplorationTab = 'odontograma';

  upperTeeth = FDI_UPPER_TEETH;
  lowerTeeth = FDI_LOWER_TEETH;
  statusOptions = DENTAL_STATUSES;
  surfaceOptions = DENTAL_SURFACES;
  perioVestibular = PERIODONTAL_ROW_VESTIBULAR;
  perioPalatino = PERIODONTAL_ROW_PALATINO;

  selectedTooth: string | null = null;
  toothForm: ToothForm = this.emptyToothForm();
  previewImage: DentalImage | null = null;
  selectedPerioTooth: string | null = null;

  // Opciones de Notas clínicas
  tissueZones = SOFT_TISSUE_ZONES;
  tissueStates = ['sin-alteraciones', 'lesion', 'inflamacion', 'ulceracion', 'cambio-color', 'otro'];
  mordidaTypes = ['normal', 'sobremordida', 'cruzada', 'abierta', 'otra'];
  angleClasses = ['clase1', 'clase2', 'clase3'];
  yesNo = ['si', 'no'];
  atmOptions = ['dolor', 'chasquido', 'crepitacion', 'limitacion', 'sin-alteraciones'];
  higieneLevels = ['buena', 'regular', 'deficiente'];
  severityLevels = ['ausente', 'leve', 'moderado', 'severo'];
  movementLevels = ['0', '1', '2', '3'];
  furcationLevels = ['0', '1', '2', '3'];
  periodonciaStates = ['pendiente', 'sano', 'gingivitis', 'perio-leve', 'perio-moderada', 'perio-avanzada'];

  constructor(@Inject(CONSULTATION_STEP_DATA) step: ConsultationStepData) {
    this.data = step.data;
    this.seed();
  }

  private seed(): void {
    if (!this.data.odontograma || !this.data.odontograma.teeth) {
      this.data.odontograma = { teeth: {} };
    }
    if (!Array.isArray(this.data.imagenes)) {
      this.data.imagenes = [];
    }
    if (!this.data.periodoncia || typeof this.data.periodoncia !== 'object') {
      this.data.periodoncia = {
        estado: 'pendiente',
        indicePlaca: null,
        sangradoSondaje: null,
        dientes: {},
      };
    }
    if (!this.data.notasClinicas || typeof this.data.notasClinicas !== 'object') {
      this.data.notasClinicas = {
        tejidosBlandos: {},
        oclusion: { mordida: '', claseAngle: '', overbite: null, overjet: null, bruxismo: '', atm: [] },
        higiene: { higiene: '', placa: '', calculo: '', halitosis: '' },
        hallazgosGenerales: '',
      };
      for (const zone of SOFT_TISSUE_ZONES) {
        this.data.notasClinicas.tejidosBlandos[zone.key] = { estado: 'sin-alteraciones', observaciones: '' };
      }
    }
  }

  // ---- Traducción de valores de formulario ----
  private lbl(suffix: string): string {
    return `CONSULTATION_WORKSPACE.${suffix}`;
  }

  tissueStateLabelKey(value: string): string {
    return this.lbl(`NOTE_TJ_OPTION_${value.toUpperCase().replace(/-/g, '_')}`);
  }

  mordidaLabelKey(value: string): string {
    return this.lbl(`NOTE_OCLUSION_MORD_${value.toUpperCase()}`);
  }

  angleLabelKey(value: string): string {
    return this.lbl(`NOTE_ANGLE_${value.toUpperCase()}`);
  }

  yesNoLabelKey(value: string): string {
    return this.lbl(`NOTE_${value.toUpperCase()}`);
  }

  atmLabelKey(value: string): string {
    return this.lbl(`NOTE_ATM_${value.toUpperCase().replace(/-/g, '_')}`);
  }

  higieneLabelKey(value: string): string {
    return this.lbl(`NOTE_HIGIENE_${value.toUpperCase()}`);
  }

  severityLabelKey(value: string): string {
    return this.lbl(`NOTE_LEVEL_${value.toUpperCase()}`);
  }

  movementLabelKey(value: string): string {
    return this.lbl(`PERIO_MOV_${value}`);
  }

  furcationLabelKey(value: string): string {
    return this.lbl(`PERIO_FURC_${value}`);
  }

  periodonciaStateLabelKey(value: string): string {
    return this.lbl(`PERIO_STATE_${value.toUpperCase().replace(/-/g, '_')}`);
  }

  get imageTypes(): string[] {
    return [
      'CONSULTATION_WORKSPACE.IMG_TYPE_FOTO_INTRA',
      'CONSULTATION_WORKSPACE.IMG_TYPE_RADIO_PERIAPICAL',
      'CONSULTATION_WORKSPACE.IMG_TYPE_BITEWING',
      'CONSULTATION_WORKSPACE.IMG_TYPE_PANORAMICA',
      'CONSULTATION_WORKSPACE.IMG_TYPE_CBCT',
      'CONSULTATION_WORKSPACE.IMG_TYPE_FOTO_EXTRA',
      'CONSULTATION_WORKSPACE.IMG_TYPE_OTRO',
    ];
  }

  // ---- Notas clínicas ----
  get notas(): DentalNotasClinicas {
    this.seed();
    return this.data.notasClinicas;
  }

  asNum(value: number | null | undefined): number {
    return Number(value) || 0;
  }

  numOrNull(value: any): number | null {
    const n = Number(value);
    return isNaN(n) ? null : n;
  }

  toggleAtm(value: string): void {
    const atm = this.notas.oclusion.atm;
    const idx = atm.indexOf(value);
    if (idx >= 0) {
      atm.splice(idx, 1);
    } else {
      atm.push(value);
    }
  }

  // ---- Odontograma ----
  finding(tooth: string): DentalFinding {
    return findingFor(tooth, this.data);
  }

  toothStatus(tooth: string): DentalExplorationStatus | undefined {
    return this.finding(tooth).status;
  }

  toothSurfaces(tooth: string): DentalSurface[] {
    return this.finding(tooth).surfaces || [];
  }

  hasFinding(tooth: string): boolean {
    return !!this.finding(tooth).status;
  }

  get hasAnyFinding(): boolean {
    return [...this.upperTeeth, ...this.lowerTeeth].some((t) => this.hasFinding(t));
  }

  toothStyle(tooth: string): { [klass: string]: string } {
    const status = this.toothStatus(tooth);
    const cfg = status
      ? this.statusOptions.find((s) => s.value === status)
      : null;
    if (cfg) {
      return { background: cfg.color, borderColor: cfg.color, color: '#ffffff' };
    }
    return { background: '#eef4f7', borderColor: 'rgba(172,205,220,0.5)', color: '#0c2d57' };
  }

  onSelectTooth(tooth: string): void {
    this.selectedTooth = tooth;
    const f = this.finding(tooth);
    this.toothForm = {
      status: f.status || ('' as DentalExplorationStatus),
      surfaces: f.surfaces ? [...f.surfaces] : [],
      observations: f.observations || '',
    };
  }

  surfaceShort(surface: DentalSurface): string {
    return this.surfaceOptions.find((s) => s.value === surface)?.short || '';
  }

  toggleSurface(surface: DentalSurface): void {
    const idx = this.toothForm.surfaces.indexOf(surface);
    if (idx >= 0) {
      this.toothForm.surfaces.splice(idx, 1);
    } else {
      this.toothForm.surfaces.push(surface);
    }
  }

  isSurfaceToggled(surface: DentalSurface): boolean {
    return this.toothForm.surfaces.includes(surface);
  }

  saveFinding(): void {
    if (!this.selectedTooth) return;
    const f = this.finding(this.selectedTooth);
    if (this.toothForm.status) {
      f.status = this.toothForm.status;
    }
    f.surfaces = [...this.toothForm.surfaces];
    f.observations = (this.toothForm.observations || '').trim();
  }

  removeFinding(tooth: string): void {
    const teeth = this.data?.odontograma?.teeth;
    if (teeth && teeth[tooth]) {
      delete teeth[tooth];
    }
    if (this.selectedTooth === tooth) {
      this.clearToothForm();
    }
  }

  clearToothForm(): void {
    this.selectedTooth = null;
    this.toothForm = this.emptyToothForm();
  }

  private emptyToothForm(): ToothForm {
    return {
      status: '' as DentalExplorationStatus,
      surfaces: [],
      observations: '',
    };
  }

  // ---- Imágenes ----
  get imagenes(): DentalImage[] {
    this.seed();
    return this.data.imagenes as DentalImage[];
  }

  addImages(files: FileList | null): void {
    if (!files || !files.length) return;
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;
      this.data.imagenes.push({
        id: `dx${Date.now()}${Math.random().toString(36).slice(2, 8)}`,
        type: this.lbl('IMG_TYPE_FOTO_INTRA'),
        date: new Date().toISOString().split('T')[0],
        tooth: '',
        description: '',
        name: file.name,
        size: file.size,
        mimeType: file.type,
        file,
        objectUrl: URL.createObjectURL(file),
      });
    }
  }

  removeImage(index: number): void {
    const target = this.data.imagenes[index];
    if (target && target.objectUrl) {
      URL.revokeObjectURL(target.objectUrl);
    }
    this.data.imagenes.splice(index, 1);
    if (this.previewImage === target) {
      this.previewImage = null;
    }
  }

  closePreview(): void {
    this.previewImage = null;
  }

  // ---- Periodoncia ----
  get periodoncia(): any {
    this.seed();
    return this.data.periodoncia;
  }

  onSelectPerioTooth(tooth: string): void {
    this.selectedPerioTooth = tooth;
  }

  perioHasData(tooth: string): boolean {
    const t = this.data?.periodoncia?.dientes?.[tooth];
    if (!t) return false;
    const depths = Object.values(t.profundidad || {}).some((v) => Number(v) > 0);
    return (
      depths ||
      !!t.margenGingival ||
      !!t.nivelInsercion ||
      !!t.sangrado ||
      !!t.supuracion ||
      !!t.movilidad ||
      !!t.furcacion
    );
  }

  periodeToothFor(tooth: string): DentalPeriodonciaTooth {
    const dientes = this.data.periodoncia.dientes;
    if (!dientes[tooth]) {
      dientes[tooth] = emptyPeriodonciaTooth();
    }
    return dientes[tooth];
  }

  get perioSelectedTooth(): DentalPeriodonciaTooth {
    if (!this.selectedPerioTooth) {
      throw new Error('No tooth selected');
    }
    return this.periodeToothFor(this.selectedPerioTooth);
  }

  num(tooth: DentalPeriodonciaTooth, surface: DentalPeriodontalSurface): number {
    return Number(tooth.profundidad[surface]) || 0;
  }

  setDepth(tooth: DentalPeriodonciaTooth, surface: DentalPeriodontalSurface, value: any): void {
    const n = Math.round(Number(value)) || 0;
    if (n > 0) {
      tooth.profundidad[surface] = Math.min(Math.max(n, 0), 15);
    } else {
      delete tooth.profundidad[surface];
    }
  }

  setPercent(value: any): number {
    const n = Math.round(Number(value)) || 0;
    return Math.min(Math.max(n, 0), 100);
  }

  // ---- Panel / advertencias ----
  get explorationSummary(): DentalExplorationSummary {
    return computeExplorationSummary(this.data);
  }

  get clinicalAlerts(): DentalClinicalAlert[] {
    return computeClinicalAlerts(this.data);
  }
}