import { IClinic } from 'src/app/entities/IClinic';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { PatientsService } from 'src/app/components/patients/services/patients.service';
import { IPatient } from 'src/app/entities/IPatient';
import { EditModalComponent } from '../../../shared/edit-modal/edit-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { selectClinicId } from 'src/app/store/selectors/auth.selectors';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css'],
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
export class PatientsComponent implements OnInit, OnDestroy {
  patients: IPatient[] = [];
  addPatient: boolean = false;
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
          console.log('Clinic ID in PatientsComponent from store:', clinicId);
          this.getPatients();
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addPatientToggle(): void {
    this.addPatient = !this.addPatient;
  }

  onPatientAdded(): void {
    console.log('Patient added event received'); // Debug log
    this.addPatientToggle();
    this.getPatients();
    // No need to call loadPatients as the subscription will handle updates
  }

  getPatients(): void {
    this.patientsService
      .getPatients(this.clinicId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((patients) => {
        this.patients = patients;
        console.log('Patients loaded:', this.patients);
      });
  }

  deletePatient(id: number): void {
    this.patientsService
      .deletePatient(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.getPatients();
        console.log(res);
      });
  }

  // editPatient(patient: IPatient): void {
  //   this.editPatientData = { ...patient };
  //   console.log('EditPatientData: ', this.editPatientData);
  //   this.editPatientId = this.editPatientData.id;
  // }

  editPatient(patient: IPatient): void {
    this.dialog
      .open(EditModalComponent, {
        data: {
          entityType: 'patient',
          data: patient,
          title: 'Edit Patient',
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.saveEdit(result);
        }
      });
  }

  saveEdit(patient: Partial<IPatient>): void {
    this.patientsService
      .editPatient(patient)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.cancelEdit();
        this.getPatients();
        console.log(res);
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

