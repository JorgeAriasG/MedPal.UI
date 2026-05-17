import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ClinicalDataService } from 'src/app/services/clinical-data.service';

export interface AntecedentsData {
  familiares: string;
  patologicos: string;
  noPatologicos: string;
  quirurgicos: string;
  habitos: string;
  observaciones: string;
}

@Component({
  selector: 'app-patient-antecedents',
  templateUrl: './patient-antecedents.component.html',
  styleUrls: ['./patient-antecedents.component.css'],
  standalone: false,
})
export class PatientAntecedentsComponent implements OnInit, OnDestroy {
  @Input() patientDetailsId!: number;

  data: AntecedentsData = {
    familiares: '',
    patologicos: '',
    noPatologicos: '',
    quirurgicos: '',
    habitos: '',
    observaciones: '',
  };

  loading = false;
  saving = false;
  error = '';
  private destroy$ = new Subject<void>();

  constructor(
    private clinicalDataService: ClinicalDataService,
    private translate: TranslateService
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
    this.clinicalDataService
      .getAntecedents(this.patientDetailsId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (json) => {
          if (json) {
            try {
              this.data = { ...this.data, ...JSON.parse(json) };
            } catch {
              this.data.observaciones = json;
            }
          }
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  save(): void {
    this.saving = true;
    this.error = '';
    this.clinicalDataService
      .updateAntecedents(this.patientDetailsId, JSON.stringify(this.data))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.saving = false;
        },
        error: (err) => {
          this.saving = false;
          this.error = this.translate.instant('PATIENTS.ERROR_SAVE_ANTECEDENTS');
          console.error(err);
        },
      });
  }
}
