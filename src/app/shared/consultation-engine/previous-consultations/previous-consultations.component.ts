import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MedicalHistoryService } from 'src/app/services/medical-history.service';
import { MedicalHistorySummaryDTO } from 'src/app/entities/medical-history.model';

@Component({
  selector: 'app-previous-consultations',
  templateUrl: './previous-consultations.component.html',
  styleUrls: ['./previous-consultations.component.css'],
  standalone: false,
})
export class PreviousConsultationsComponent implements OnInit, OnDestroy {
  @Input() patientDetailsId!: number;

  entries: MedicalHistorySummaryDTO[] = [];
  loading = false;

  private destroy$ = new Subject<void>();

  constructor(private medicalHistoryService: MedicalHistoryService) {}

  ngOnInit(): void {
    this.load();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private load(): void {
    if (!this.patientDetailsId) return;
    this.loading = true;
    this.medicalHistoryService
      .getRecentHistory(this.patientDetailsId, 5)
      .pipe(takeUntil(this.destroy$))
      .subscribe((entries) => {
        this.entries = entries;
        this.loading = false;
      });
  }

  formatDate(date: string | Date): string {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
}
