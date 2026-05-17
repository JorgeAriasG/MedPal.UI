import { IAppointment } from './../../../entities/IAppointment';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { AppointmensService } from '../services/appointmens.service';
import { MatDialog } from '@angular/material/dialog';
import { NewAppointmentComponent } from '../new-appointment/new-appointment.component';
import { EditModalComponent } from 'src/app/shared/edit-modal/edit-modal.component';
import { IInputData } from 'src/app/entities/IInputData';
import { CalendarEvent } from 'calendar-utils';
import { icon } from '@fortawesome/fontawesome-svg-core';
import { ClinicService } from '../../clinics/services/clinic.service';
import { Store } from '@ngrx/store';
import { selectClinicContext } from 'src/app/store/selectors/auth.selectors';
import { setClinic } from 'src/app/store/actions/auth.actions';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CalendarView } from 'angular-calendar';
import { toHourMinute } from 'src/app/shared/utils/date-utils';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css'],
  standalone: false,
})
export class AppointmentComponent implements OnInit, OnDestroy {
  faPencil = faPencil;
  appointments: any[] = [];
  clinicId: number | null | undefined;
  inputData: IInputData = {
    isEditable: false,
    data: {},
  };
  loading = false;
  searchQuery = '';
  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;
  displayMode: 'calendar' | 'list' = 'calendar';
  events: CalendarEvent[] = [];
  activeDayIsOpen: boolean = false;
  dayStartHour = 8;
  dayStartMinute = 0;
  dayEndHour = 18;
  dayEndMinute = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private appointmentService: AppointmensService,
    private dialog: MatDialog,
    private clinicService: ClinicService,
    private store: Store,
  ) {}

  ngOnInit() {
    this.store
      .select(selectClinicContext)
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ clinicId, clinicOpen, clinicClose }) => {
        if (clinicOpen) {
          this.dayStartHour = clinicOpen.hour;
          this.dayStartMinute = clinicOpen.minute;
        }
        if (clinicClose) {
          this.dayEndHour = clinicClose.hour;
          this.dayEndMinute = clinicClose.minute;
        }

        if (clinicId) {
          this.clinicId = clinicId;
          this.getAllAppointmentsById();
        } else {
          this.clinicService
            .getClinics()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (clinics) => {
                if (clinics && clinics.length > 0) {
                  this.store.dispatch(
                    setClinic({
                      clinicId: clinics[0].id,
                      open: clinics[0].open ? toHourMinute(clinics[0].open) : null,
                      close: clinics[0].close ? toHourMinute(clinics[0].close) : null,
                    }),
                  );
                }
              },
              error: (err) => {
                console.error('Error fetching clinics:', err);
              },
            });
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addAppointmentToggle(): void {
    const dialogRef = this.dialog.open(NewAppointmentComponent, {
      width: '800px',
      panelClass: 'appointment-dialog-container',
      data: { clinicId: this.clinicId }
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((refresh) => {
        if (refresh) {
          this.getAllAppointmentsById();
        }
      });
  }

  getAllAppointmentsById(): void {
    if (!this.clinicId) {
      console.warn('Clinic ID is not set');
      return;
    }

    this.loading = true;
    this.appointmentService
      .getAppointments(Number(this.clinicId))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any[]) => {
          this.loading = false;
          this.appointments = response;
          const statusColors: Record<string, { primary: string; secondary: string; secondaryText: string }> = {
            Scheduled: { primary: '#2C3E50', secondary: 'rgba(44,62,80,0.12)', secondaryText: '#2C3E50' },
            Confirmed: { primary: '#34D399', secondary: 'rgba(52,211,153,0.12)', secondaryText: '#059669' },
            Cancelled: { primary: '#F87171', secondary: 'rgba(248,113,113,0.12)', secondaryText: '#DC2626' },
            Completed: { primary: '#A78BFA', secondary: 'rgba(167,139,250,0.12)', secondaryText: '#7C3AED' },
          };

          this.events = this.appointments.map((appointment: any) => {
            const [year, month, day] = appointment.date.split('-').map(Number);
            const [hour, minute] = appointment.time.split(':').map(Number);
            const colors = statusColors[appointment.status] || statusColors['Scheduled'];

            return {
              start: new Date(year, month - 1, day, hour, minute),
              end: new Date(year, month - 1, day, hour, minute),
              title: appointment.patient.name || 'No Name',
              color: colors,
              actions: [
                {
                  label: 'Edit',
                  icon: icon(faPencil),
                  onClick: ({ event }: { event: CalendarEvent }) => {
                    this.openEditModal(appointment);
                  },
                },
              ],
            };
          });
        },
        error: (error) => {
          console.error('Error fetching appointments:', error);
          this.loading = false;
        },
      });
  }

  /**
   * Abre el modal de edición usando el componente especializado de Citas
   */
  public openEditModal(appointment: any): void {
    const dialogRef = this.dialog.open(NewAppointmentComponent, {
      width: '800px',
      panelClass: 'appointment-dialog-container',
      data: {
        appointment: appointment,
        clinicId: this.clinicId,
      }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((refresh) => {
        if (refresh) {
          this.getAllAppointmentsById();
        }
      });
  }


  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery = value.toLowerCase();
  }

  trackByAppointment(_index: number, appointment: any): number {
    return appointment.id;
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  setDisplayMode(mode: 'calendar' | 'list') {
    this.displayMode = mode;
  }
}
