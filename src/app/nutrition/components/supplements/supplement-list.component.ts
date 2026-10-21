import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ISupplement, SupplementForm } from '../../models';
import { NutritionService } from '../../services/nutrition.service';

@Component({
  selector: 'app-supplement-list',
  templateUrl: './supplement-list.component.html',
  styleUrls: ['./supplement-list.component.css'],
  standalone: false,
})
export class SupplementListComponent implements OnInit, OnDestroy {
  @Input() patientDetailsId!: number;

  supplements: ISupplement[] = [];
  loading = false;

  formLabels: Record<SupplementForm, string> = {
    tablet: 'Tableta',
    capsule: 'Cápsula',
    powder: 'Polvo',
    liquid: 'Líquido',
    injection: 'Inyección',
    spray: 'Spray',
    gummy: 'Gomita',
    bar: 'Barra',
    other: 'Otro',
  };

  private destroy$ = new Subject<void>();

  constructor(
    private nutritionService: NutritionService,
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
    this.nutritionService.getSupplements(this.patientDetailsId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.supplements = data;
        this.loading = false;
      });
  }

  deleteSupplement(id: number): void {
    if (!confirm('¿Eliminar este suplemento?')) return;
    this.nutritionService.deleteSupplement(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.loadData());
  }

  getFormLabel(form: SupplementForm | undefined): string {
    return form ? this.formLabels[form] : '';
  }

  trackById(_index: number, item: ISupplement): number | undefined {
    return item.id;
  }
}
