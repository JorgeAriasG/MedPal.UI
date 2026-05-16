import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppointmensService } from '../appointments/services/appointmens.service';
import { PatientsService } from '../patients/services/patients.service';
import { MatDialog } from '@angular/material/dialog';
import { NewAppointmentComponent } from '../appointments/new-appointment/new-appointment.component';
import { EditModalComponent } from 'src/app/shared/edit-modal/edit-modal.component';
import { IAppointment } from 'src/app/entities/IAppointment';
import { IPatient } from 'src/app/entities/IPatient';
import { selectUserId } from 'src/app/store/selectors/auth.selectors';
import { ClinicContextService } from 'src/app/services/clinic-context.service';
import { KeyboardShortcutService } from 'src/app/services/keyboard-shortcut.service';

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
  todayCompleted: number = 0;
  todayCancelled: number = 0;
  totalPatientsThisMonth: number = 0;
  nextAppointment: any = null;

  // Lists
  upcomingAppointments: any[] = [];
  recentPatients: IPatient[] = [];
  patientMap: Map<number | undefined, IPatient> = new Map();

  get greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  }

  get todayDate(): string {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    return today.toLocaleDateString('es-ES', options);
  }

  constructor(
    private appointmentService: AppointmensService,
    private patientService: PatientsService,
    private clinicContextService: ClinicContextService,
    private shortcutService: KeyboardShortcutService,
    private store: Store,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.clinicContextService
      .getClinicContext()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (clinicId) => {
          if (clinicId) {
            this.clinicId = clinicId;
            this.loadDashboardData();
          }
        },
        error: (err) => console.error('Error getting clinic context:', err),
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

    forkJoin({
      patients: this.patientService.getPatients(this.clinicId),
      appointments: this.appointmentService.getAppointments(this.clinicId!),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ patients, appointments }: { patients: IPatient[]; appointments: any[] }) => {
          this.patientMap.clear();
          patients.forEach((patient) => {
            if (patient.id) {
              this.patientMap.set(patient.id, patient);
            }
          });
          this.calculatePatientMetrics(patients);
          this.calculateAppointmentMetrics(appointments);
        },
        error: (err) => {
          console.error('Error loading dashboard data:', err);
        },
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

    const todayAppointments = appointments.filter((apt) => {
      const aptDate = this.parseDate(apt.date);
      return aptDate >= today && aptDate <= endOfToday;
    });

    this.appointmentsTodayCount = todayAppointments.length;
    this.todayCompleted = todayAppointments.filter((apt) => apt.status === 'Completed').length;
    this.todayCancelled = todayAppointments.filter((apt) => apt.status === 'Cancelled').length;

    this.appointmentsThisWeekCount = appointments.filter((apt) => {
      const aptDate = this.parseDate(apt.date);
      return aptDate >= today && aptDate <= endOfWeek;
    }).length;

    const futureAppointments = appointments
      .filter((apt) => this.parseDate(apt.date) >= today)
      .sort((a, b) => {
        const dateA = this.parseDate(a.date);
        const dateB = this.parseDate(b.date);
        return dateA.getTime() - dateB.getTime();
      });

    this.nextAppointment = futureAppointments[0] || null;

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

  }

  private calculatePatientMetrics(patients: IPatient[]): void {
    this.totalPatientsThisMonth = patients.length;
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

  openOmnibar(): void {
    this.shortcutService.triggerOmnibar();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
