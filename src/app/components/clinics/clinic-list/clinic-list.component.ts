import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddClinicComponent } from '../add-clinic/add-clinic.component';
import { ClinicService } from '../services/clinic.service';
import { IClinic } from 'src/app/entities/IClinic';
import { MatOptionSelectionChange } from '@angular/material/core';
import { Store } from '@ngrx/store';
import { AuthState } from 'src/app/store/reducers/auth.reducer';
import { selectClinicId } from 'src/app/store/selectors/auth.selectors';
import { setClinic } from 'src/app/store/actions/auth.actions';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-clinic-list',
  templateUrl: './clinic-list.component.html',
  styleUrls: ['./clinic-list.component.css'],
  standalone: false,
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-12px)' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class ClinicListComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'name',
    'location',
    'contactInfo',
    'hours',
    'actions',
  ];
  clinics: IClinic[] = [];
  isEdit: boolean = false;
  clinicId: number | null | undefined;
  selectedClinicName: string | null = null;

  // Subject para cancelar suscripciones
  private destroy$ = new Subject<void>();

  constructor(
    private dialog: MatDialog,
    private clinicService: ClinicService,
    private store: Store<{ auth: AuthState }>
  ) {}

  ngOnInit() {
    this.getClinics();

    // Usar takeUntil para cancelar la suscripción cuando el componente se destruya
    this.store
      .select(selectClinicId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (clinicId) => {
          console.log('Clinic ID from store:', clinicId);
          this.clinicId = clinicId;
          // Actualizar el nombre de la clínica seleccionada
          this.selectedClinicName =
            this.clinics.find((clinic) => clinic.id === this.clinicId)?.name ??
            null;
        },
        error: (err) => {
          console.error('Error getting clinic ID from store:', err);
        },
      });
  }

  ngOnDestroy() {
    // Cancelar todas las suscripciones
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectClinic($event: MatOptionSelectionChange): void {
    this.clinicId =
      this.clinics.find((clinic) => clinic.name === $event.source.value)?.id ??
      null;
    this.store.dispatch(setClinic({ clinicId: this.clinicId }));
    console.log('Selected Clinic ID:', this.clinicId);
    console.log($event);
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddClinicComponent, {
      width: '500px',
      disableClose: false,
      panelClass: 'custom-dialog'
    });

    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res) {
        this.getClinics();
      }
    });
  }

  async getClinics(): Promise<void> {
    try {
      this.clinicService
        .getClinics()
        .pipe(takeUntil(this.destroy$))
        .subscribe((clinics) => {
          console.log('Clinics', clinics);
          this.clinics = clinics;
          this.selectedClinicName =
            this.clinics.find((clinic) => clinic.id === this.clinicId)?.name ??
            null;
        });
    } catch (error) {
      console.error(error);
    }
  }

  editClinic(clinic: IClinic): void {
    this.isEdit = true;
    this.dialog.open(AddClinicComponent, {
      width: '400px',
      data: [clinic, this.isEdit],
    });
  }

  deleteClinic(id: number): void {}

  trackByClinic(index: number, clinic: IClinic): number | null {
    return clinic.id;
  }
}
