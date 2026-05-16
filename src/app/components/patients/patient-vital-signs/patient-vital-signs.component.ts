import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { ClinicalDataService } from 'src/app/services/clinical-data.service';
import { IVitalSign } from 'src/app/entities/IVitalSign';
import { VitalSignDialogComponent } from './vital-sign-dialog.component';

@Component({
  selector: 'app-patient-vital-signs',
  templateUrl: './patient-vital-signs.component.html',
  styleUrls: ['./patient-vital-signs.component.css'],
  standalone: false,
})
export class PatientVitalSignsComponent implements OnInit, OnDestroy {
  @Input() patientDetailsId!: number;

  displayedColumns: string[] = ['recordedAt', 'bloodPressure', 'heartRate', 'temperature', 'oxygenSaturation', 'weight', 'bmi', 'actions'];
  dataSource: IVitalSign[] = [];

  loading = false;
  error = '';
  private destroy$ = new Subject<void>();

  @ViewChild(MatTable) table!: MatTable<IVitalSign>;

  constructor(
    private clinicalDataService: ClinicalDataService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData(): void {
    this.loading = true;
    this.error = '';
    this.clinicalDataService
      .getVitalSigns(this.patientDetailsId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.dataSource = data;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.error = 'Error al cargar signos vitales';
        },
      });
  }

  openDialog(vitalSign?: IVitalSign): void {
    const dialogRef = this.dialog.open(VitalSignDialogComponent, {
      width: '700px',
      maxHeight: '90vh',
      data: {
        patientDetailsId: this.patientDetailsId,
        vitalSign: vitalSign || null,
      },
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result) this.loadData();
      });
  }

  delete(id: number): void {
    if (!confirm('¿Eliminar este registro de signos vitales?')) return;
    this.clinicalDataService
      .deleteVitalSign(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.loadData(),
        error: () => this.error = 'Error al eliminar',
      });
  }
}
