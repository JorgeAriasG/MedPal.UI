import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppointmensService } from '../appointments/services/appointmens.service';
import { PatientsService } from '../patients/services/patients.service';
import { ClinicService } from '../clinics/services/clinic.service';
import { MatDialog } from '@angular/material/dialog';
import { NewAppointmentComponent } from '../appointments/new-appointment/new-appointment.component';
import { EditModalComponent } from 'src/app/shared/edit-modal/edit-modal.component';
import { IAppointment } from 'src/app/entities/IAppointment';
import { IPatient } from 'src/app/entities/IPatient';
import { selectClinicId, selectUserId } from 'src/app/store/selectors/auth.selectors';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false
})
export class HomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // State
  clinicId: number | null | undefined;
  userId: number | null | undefined;
  currentUser: any = null;

  // KPIs
  appointmentsTodayCount: number = 0;
  appointmentsThisWeekCount: number = 0;
  totalPatientsThisMonth: number = 0;
  newPatientsThisMonth: number = 0;
  completionRatePercentage: number = 0;
  nextAppointment: any = null;

  // Lists
  upcomingAppointments: any[] = [];
  recentPatients: IPatient[] = [];
  patientMap: Map<number | undefined, IPatient> = new Map();

  constructor(
    private appointmentService: AppointmensService,
    private patientService: PatientsService,
    private clinicService: ClinicService,
    private store: Store,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.store
      .select(selectClinicId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (clinicId) => {
          if (clinicId) {
            this.clinicId = clinicId;
            this.loadDashboardData();
          } else {
            this.clinicService
              .getClinics()
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: (clinics) => {
                  if (clinics && clinics.length > 0) {
                    this.clinicId = clinics[0].id;
                    this.loadDashboardData();
                  }
                },
                error: (err) => console.error('Error fetching clinics:', err),
              });
          }
        },
        error: (err) => console.error('Error getting clinic ID from store:', err),
      });

    this.store
      .select(selectUserId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (userId) => {
          this.userId = userId;
        },
        error: (err) => console.error('Error getting user ID:', err),
      });
  }

  loadDashboardData(): void {
    if (!this.clinicId) return;

    // Cargar pacientes primero para crear mapa de búsqueda
    this.patientService
      .getPatients(this.clinicId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (patients: IPatient[]) => {
          // Crear mapa de pacientes por ID para búsqueda rápida
          this.patientMap.clear();
          patients.forEach((patient) => {
            if (patient.id) {
              this.patientMap.set(patient.id, patient);
            }
          });
          this.calculatePatientMetrics(patients);

          // Ahora cargar citas
          this.appointmentService
            .getAppointments(this.clinicId!)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (appointments: any[]) => {
                this.calculateAppointmentMetrics(appointments);
              },
              error: (err) => console.error('Error loading appointments:', err),
            });
        },
        error: (err) => console.error('Error loading patients:', err),
      });
  }

  private calculateAppointmentMetrics(appointments: any[]): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);

    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // Citas hoy
    this.appointmentsTodayCount = appointments.filter((apt) => {
      const aptDate = this.parseDate(apt.date);
      return aptDate >= today && aptDate <= endOfToday;
    }).length;

    // Citas esta semana
    this.appointmentsThisWeekCount = appointments.filter((apt) => {
      const aptDate = this.parseDate(apt.date);
      return aptDate >= today && aptDate <= endOfWeek;
    }).length;

    // Próxima cita
    const futureAppointments = appointments
      .filter((apt) => this.parseDate(apt.date) >= today)
      .sort((a, b) => {
        const dateA = this.parseDate(a.date);
        const dateB = this.parseDate(b.date);
        return dateA.getTime() - dateB.getTime();
      });

    this.nextAppointment = futureAppointments[0] || null;

    // Upcoming appointments (próximas 48 horas)
    const endOf48h = new Date(today);
    endOf48h.setDate(today.getDate() + 2);
    endOf48h.setHours(23, 59, 59, 999);

    this.upcomingAppointments = appointments
      .filter((apt) => {
        const aptDate = this.parseDate(apt.date);
        return aptDate >= today && aptDate <= endOf48h;
      })
      .sort((a, b) => {
        const dateA = this.parseDate(a.date);
        const dateB = this.parseDate(b.date);
        if (dateA.getTime() !== dateB.getTime()) {
          return dateA.getTime() - dateB.getTime();
        }
        const timeA = this.parseTime(a.time);
        const timeB = this.parseTime(b.time);
        return timeA - timeB;
      });

    // Tasa de completitud
    const completedAppointments = appointments.filter(
      (apt) => apt.status === 'Completed'
    ).length;
    this.completionRatePercentage =
      appointments.length > 0
        ? Math.round((completedAppointments / appointments.length) * 100)
        : 0;
  }

  private calculatePatientMetrics(patients: IPatient[]): void {
    // Total patients this month (use clinic's patient list as proxy)
    this.totalPatientsThisMonth = patients.length;
    this.newPatientsThisMonth = Math.max(0, Math.floor(patients.length * 0.15)); // Estimate ~15% as new

    // Pacientes recientes (últimas 4 - usando el orden del arreglo)
    this.recentPatients = patients.slice(0, 4);
  }

  private parseDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  private parseTime(timeString: string): number {
    const [hour, minute] = timeString.split(':').map(Number);
    return hour * 60 + minute;
  }

  // Navigation methods
  navigateToCalendar(): void {
    this.router.navigate(['/appointments']);
  }

  navigateToPatients(): void {
    this.router.navigate(['/patients']);
  }

  navigateToClinics(): void {
    this.router.navigate(['/clinics']);
  }

  navigateToPrescriptions(): void {
    this.router.navigate(['/prescriptions']);
  }

  openNewAppointmentDialog(): void {
    const dialogRef = this.dialog.open(NewAppointmentComponent, {
      width: '800px',
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) {
          this.loadDashboardData();
        }
      });
  }

  openEditAppointmentModal(appointment: any): void {
    const patient = this.patientMap.get(appointment.patientId);
    const dialogRef = this.dialog.open(EditModalComponent, {
      width: '600px',
      data: {
        entityType: 'appointment',
        data: {
          date: appointment.date,
          time: appointment.time,
          notes: appointment.notes,
          status: appointment.status,
          patientName: patient?.name,
          patientLastname: patient?.lastname,
        },
        title: 'Edit Appointment',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result) {
          this.loadDashboardData();
        }
      });
  }

  getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
    return diffDays > 7 ? 'Next week' : 'Overdue';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
