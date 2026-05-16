import { IClinic } from 'src/app/entities/IClinic';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { PatientsService } from 'src/app/components/patients/services/patients.service';
import { IPatient } from 'src/app/entities/IPatient';
import { EditModalComponent } from '../../../shared/edit-modal/edit-modal.component';
import { NewPatientComponent } from '../new-patient/new-patient.component';
import { MatDialog } from '@angular/material/dialog';
import { fadeIn } from 'src/app/shared/animations';
import { Store } from '@ngrx/store';
import { selectClinicId } from 'src/app/store/selectors/auth.selectors';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css'],
  standalone: false,
  animations: [
    fadeIn,
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
export class PatientsComponent implements OnInit, OnDestroy {
  patients: IPatient[] = [];
  displayedColumns: string[] = [
    'name',
    'email',
    'phone',
    'clinicName',
    'actions',
  ];
  editPatientId: any = null;
  editPatientData: Partial<IPatient> = {};
  clinicId: number | null | undefined;
  
  // Search & Sort State
  searchQuery: string = '';
  sortBy: string = 'name';
  descending: boolean = false;
  loading: boolean = false;
  private searchSubject = new Subject<string>();

  private destroy$ = new Subject<void>();

  constructor(
    private patientsService: PatientsService,
    private dialog: MatDialog,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.store
      .select(selectClinicId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (clinicId) => {
          this.clinicId = clinicId;
          this.getPatients();
        },
      });

    // Handle debounced search
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      this.searchQuery = query;
      this.getPatients();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(NewPatientComponent, {
      width: '600px',
      maxHeight: '90vh',
      disableClose: false,
      panelClass: 'custom-dialog'
    });

    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe((result) => {
      // NewPatientComponent handles its own saving and emits patientAdded
      // But we can still refresh here if needed
      this.getPatients();
    });
  }

  getPatients(): void {
    if (this.clinicId === undefined) return;
    
    this.loading = true;
    this.patientsService
      .getPatients(this.clinicId, this.searchQuery, this.sortBy, this.descending)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (patients) => {
          this.patients = patients;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching patients', err);
          this.loading = false;
        }
      });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value);
  }

  onSort(column: string): void {
    if (this.sortBy === column) {
      this.descending = !this.descending;
    } else {
      this.sortBy = column;
      this.descending = false;
    }
    this.getPatients();
  }

  deletePatient(id: number): void {
    this.patientsService
      .deletePatient(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.getPatients();
      });
  }

  // editPatient(patient: IPatient): void {
  //   this.editPatientData = { ...patient };
  //   console.log('EditPatientData: ', this.editPatientData);
  //   this.editPatientId = this.editPatientData.id;
  // }

  editPatient(patient: IPatient): void {
    // Normalizar clinicIds para el formulario (array → scalar para dropdown single-select)
    const modalData = {
      ...patient,
      clinicIds: patient.clinicIds?.length ? patient.clinicIds[0] : null,
    };
    this.dialog
      .open(EditModalComponent, {
        data: {
          entityType: 'patient',
          data: modalData,
          title: 'Edit Patient',
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          // Normalizar clinicIds de vuelta a array antes de enviar al API
          if (result.clinicIds !== undefined && result.clinicIds !== null) {
            result.clinicIds = Array.isArray(result.clinicIds) ? result.clinicIds : [result.clinicIds];
          }
          this.saveEdit(result);
        }
      });
  }

  saveEdit(patient: Partial<IPatient>): void {
    // Asegurar que clinicIds sea array antes de enviar
    if ((patient as any).clinicIds !== undefined && (patient as any).clinicIds !== null) {
      (patient as any).clinicIds = Array.isArray((patient as any).clinicIds)
        ? (patient as any).clinicIds
        : [(patient as any).clinicIds];
    }
    this.patientsService
      .editPatient(patient)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.cancelEdit();
        this.getPatients();
      });
  }

  cancelEdit(): void {
    this.editPatientId = null;
    this.editPatientData = {};
  }

  trackByPatient(index: number, patient: IPatient): string {
    return patient.email;
  }
}

