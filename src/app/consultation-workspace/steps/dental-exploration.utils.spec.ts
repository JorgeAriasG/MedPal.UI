import {
  FDI_ALL_TEETH,
  FDI_LOWER_TEETH,
  FDI_UPPER_TEETH,
  buildDentalClinicalNotes,
  computeClinicalAlerts,
  computeExplorationSummary,
  emptyPeriodonciaTooth,
  findingFor,
} from './dental-exploration.utils';

describe('dental-exploration.utils', () => {
  it('defines the full adult FDI chart (32 teeth)', () => {
    expect(FDI_UPPER_TEETH.length).toBe(16);
    expect(FDI_LOWER_TEETH.length).toBe(16);
    expect(FDI_ALL_TEETH.length).toBe(32);
    expect(FDI_UPPER_TEETH[0]).toBe('18');
    expect(FDI_UPPER_TEETH[15]).toBe('28');
    expect(FDI_LOWER_TEETH[0]).toBe('48');
    expect(FDI_LOWER_TEETH[15]).toBe('38');
  });

  it('computes the exploration summary from the odontograma', () => {
    const data = {
      odontograma: {
        teeth: {
          16: { status: 'caries', surfaces: ['oclusal'] },
          36: { status: 'restauracion' },
          26: { status: 'ausente' },
          11: { status: 'sano' },
        },
      },
    };

    const summary = computeExplorationSummary(data);
    expect(summary.evaluated).toBe(4);
    expect(summary.findings).toBe(3);
    expect(summary.caries).toBe(1);
    expect(summary.restauraciones).toBe(1);
    expect(summary.ausencias).toBe(1);
  });

  it('counts periodontal findings only on teeth with recorded data', () => {
    const data = {
      odontograma: { teeth: {} },
      periodoncia: {
        dientes: {
          16: { ...emptyPeriodonciaTooth(), sangrado: true, profundidad: { V: 4 } },
          26: emptyPeriodonciaTooth(),
        },
      },
    };

    expect(computeExplorationSummary(data).periodontales).toBe(1);
  });

  it('returns empty summary for an untouched exploration (soft-degrading)', () => {
    const summary = computeExplorationSummary(undefined);
    expect(summary.evaluated).toBe(0);
    expect(summary.findings).toBe(0);
    expect(summary.periodontales).toBe(0);
  });

  it('raises clinical alerts for active caries and extraction', () => {
    const data = {
      odontograma: {
        teeth: {
          16: { status: 'caries', surfaces: ['oclusal'] },
          42: { status: 'extraccion' },
        },
      },
    };

    const alerts = computeClinicalAlerts(data);
    expect(alerts.some((a) => a.key.endsWith('PANEL_ALERT_CARIES') && a.params?.['tooth'] === '16')).toBeTrue();
    expect(alerts.some((a) => a.key.endsWith('PANEL_ALERT_EXTRACCION') && a.params?.['tooth'] === '42')).toBeTrue();
  });

  it('deduplicates localized bleeding alert and reports elevated plaque', () => {
    const data = {
      odontograma: {
        teeth: {
          16: { status: 'caries' },
        },
      },
      periodoncia: {
        indicePlaca: 40,
        dientes: {
          16: { ...emptyPeriodonciaTooth(), sangrado: true },
          26: { ...emptyPeriodonciaTooth(), sangrado: true },
        },
      },
    };

    const alerts = computeClinicalAlerts(data);
    expect(alerts.filter((a) => a.key.endsWith('PANEL_ALERT_SANGRADO')).length).toBe(1);
    expect(alerts.some((a) => a.key.endsWith('PANEL_ALERT_PLACA'))).toBeTrue();
  });

  it('returns no alerts for a healthy exploration', () => {
    expect(computeClinicalAlerts({ odontograma: { teeth: {} }, periodoncia: {} })).toEqual([]);
  });

  it('builds plain-text clinical notes from findings and hygiene', () => {
    const notes = buildDentalClinicalNotes({
      odontograma: {
        teeth: {
          16: { status: 'caries', surfaces: ['oclusal'] },
          36: { status: 'restauracion' },
        },
      },
      notasClinicas: {
        higiene: { higiene: 'Regular', placa: 'Leve', calculo: 'Leve', halitosis: '' },
        hallazgosGenerales: 'Falta pieza 18',
      },
      imagenes: [{ id: 'i1' }, { id: 'i2' }],
      periodoncia: {
        estado: 'Gingivitis',
        indicePlaca: 30,
        sangradoSondaje: 15,
        dientes: {},
      },
    });

    expect(notes).toContain('Pieza 16: caries (oclusal)');
    expect(notes).toContain('Pieza 36: restauración');
    expect(notes).toContain('Higiene oral: Regular');
    expect(notes).toContain('Gingivitis');
    expect(notes).toContain('Imágenes clínicas: 2');
    expect(notes).toContain('Falta pieza 18');
  });

  it('returns empty notes when nothing was recorded', () => {
    expect(buildDentalClinicalNotes({ odontograma: { teeth: {} } })).toBe('');
  });

  it('creates a reusable finding slot per tooth', () => {
    const data: any = { odontograma: { teeth: {} } };
    const finding = findingFor('16', data);
    finding.status = 'caries';
    expect(data.odontograma.teeth['16'].status).toBe('caries');
  });
});