import { IAppointment } from './../../../entities/IAppointment';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmensService } from '../services/appointmens.service';
import { MatDialog } from '@angular/material/dialog';
import { NewAppointmentComponent } from '../new-appointment/new-appointment.component';
import { EditModalComponent } from 'src/app/shared/edit-modal/edit-modal.component';
import { IInputData } from 'src/app/entities/IInputData';
import { CalendarEvent } from 'calendar-utils';
import { ClinicService } from '../../clinics/services/clinic.service';
import { Store } from '@ngrx/store';
import { selectClinicContext } from 'src/app/store/selectors/auth.selectors';
import { setClinic } from 'src/app/store/actions/auth.actions';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { toHourMinute } from 'src/app/shared/utils/date-utils';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmStartConsultationComponent } from './confirm-start-consultation/confirm-start-consultation.component';
import { ConfirmDialogData, ConfirmDialogResult } from './confirm-start-consultation/confirm-start-consultation.component';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class AppointmentComponent implements OnInit, OnDestroy {
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
    private router: Router,
    private authService: AuthService,
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
            InProgress: { primary: '#FFA000', secondary: 'rgba(255,160,0,0.12)', secondaryText: '#FF8F00' },
            Completed: { primary: '#43A047', secondary: 'rgba(67,160,71,0.12)', secondaryText: '#2E7D32' },
            Cancelled: { primary: '#F87171', secondary: 'rgba(248,113,113,0.12)', secondaryText: '#DC2626' },
            NoShow: { primary: '#E65100', secondary: 'rgba(230,81,0,0.12)', secondaryText: '#BF360C' },
            Rescheduled: { primary: '#7B1FA2', secondary: 'rgba(123,31,162,0.12)', secondaryText: '#4A148C' },
          };

          const isClinical = this.authService.isClinicalRole();

          this.events = this.appointments.map((appointment: any) => {
            const [year, month, day] = appointment.date.split('-').map(Number);
            const [hour, minute] = appointment.time.split(':').map(Number);
            const colors = statusColors[appointment.status] || statusColors['Scheduled'];
            const start = new Date(year, month - 1, day, hour, minute);
            const end = appointment.durationMinutes
              ? new Date(year, month - 1, day, hour, minute + appointment.durationMinutes)
              : start;
            const pad = (n: number) => n.toString().padStart(2, '0');
            const timeStr = `${pad(start.getHours())}:${pad(start.getMinutes())} - ${pad(end.getHours())}:${pad(end.getMinutes())}`;
            const fullName = `${appointment.patient?.name || ''} ${appointment.patient?.lastname || ''}`.trim() || 'No Name';

            return {
              start,
              end,
              title: `${fullName}\n${timeStr}`,
              color: colors,
              meta: appointment,
              draggable: !isClinical,
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

  handleEventClick(calendarEvent: { event: CalendarEvent; sourceEvent?: MouseEvent | KeyboardEvent }): void {
    const { event, sourceEvent } = calendarEvent;
    const appointment = event.meta;
    if (!appointment) return;
    const status = appointment.status;
    if (status === 'InProgress') {
      this.navigateToConsultation(appointment);
    } else if (status === 'Scheduled' || status === 'Confirmed') {
      const patientName = appointment.patient?.name
        ? `${appointment.patient.name} ${appointment.patient.lastname || ''}`.trim()
        : 'Paciente';
      const skipConfirm = localStorage.getItem('skipConsultationConfirm') === 'true';
      if (skipConfirm) {
        this.doStartConsultation(appointment);
      } else {
        let position: { top: string; left: string } | undefined;
        if (sourceEvent instanceof MouseEvent) {
          const eventCard = (sourceEvent.target as HTMLElement)
            ?.closest<HTMLElement>('.cal-event-container, .cal-month-view .cal-event');
          if (eventCard) {
            const rect = eventCard.getBoundingClientRect();
            const popoverH = 180;
            const popoverW = 340;
            const spaceAbove = rect.top - 12;
            const spaceBelow = window.innerHeight - rect.bottom - 12;
            if (spaceAbove >= popoverH) {
              position = {
                top: `${rect.top - popoverH - 8}px`,
                left: `${Math.max(10, Math.min(rect.left + rect.width / 2 - popoverW / 2, window.innerWidth - popoverW - 10))}px`,
              };
            } else if (spaceBelow >= popoverH) {
              position = {
                top: `${rect.bottom + 8}px`,
                left: `${Math.max(10, Math.min(rect.left + rect.width / 2 - popoverW / 2, window.innerWidth - popoverW - 10))}px`,
              };
            } else {
              position = {
                top: `${Math.max(10, spaceAbove < spaceBelow ? rect.bottom + 8 : rect.top - popoverH - 8)}px`,
                left: `${Math.max(10, Math.min(rect.left + rect.width / 2 - popoverW / 2, window.innerWidth - popoverW - 10))}px`,
              };
            }
          } else {
            position = {
              top: `${Math.max(20, sourceEvent.clientY - 40)}px`,
              left: `${Math.max(10, Math.min(sourceEvent.clientX - 170, window.innerWidth - 360))}px`,
            };
          }
        }
        const dialogRef = this.dialog.open(ConfirmStartConsultationComponent, {
          width: '340px',
          panelClass: 'confirm-consultation-panel',
          backdropClass: 'confirm-consultation-backdrop',
          data: { patientName, appointmentTime: appointment.time || '' } as ConfirmDialogData,
          position,
        });
        dialogRef.afterClosed().subscribe((result: ConfirmDialogResult) => {
          if (result?.confirmed) {
            if (result.skipFuture) {
              localStorage.setItem('skipConsultationConfirm', 'true');
            }
            this.doStartConsultation(appointment);
          }
        });
      }
    } else {
      this.openEditModal(appointment);
    }
  }

  private doStartConsultation(appointment: any): void {
    this.appointmentService.startConsultation(appointment.id).subscribe({
      next: () => {
        this.navigateToConsultation(appointment);
      },
      error: (err) => {
        console.error('Error starting consultation:', err);
      },
    });
  }

  private navigateToConsultation(appointment: any): void {
    this.router.navigate(['/appointments', appointment.id, 'consultation']);
  }

  private checkOverlap(event: CalendarEvent, newStart: Date, newEnd?: Date): boolean {
    const end = newEnd || newStart;
    return this.events.some(existing => {
      if (existing === event) return false;
      const existingEnd = existing.end || existing.start;
      return newStart < existingEnd && end > existing.start;
    });
  }

  validateEventTimesChanged = (ev: CalendarEventTimesChangedEvent): boolean => {
    if (ev.type === 'resize') return true;
    return !this.checkOverlap(ev.event, ev.newStart, ev.newEnd);
  };

  onEventTimesChanged(eventTimesChangedEvent: CalendarEventTimesChangedEvent): void {
    if (eventTimesChangedEvent.type === 'resize') return;
    const appt = eventTimesChangedEvent.event.meta;
    if (!appt) return;
    const ns = eventTimesChangedEvent.newStart;
    const os = eventTimesChangedEvent.event.start;
    if (ns.getTime() === os.getTime()) return;
    const event = eventTimesChangedEvent.event;
    const oe = event.end;
    if (this.checkOverlap(event, ns, eventTimesChangedEvent.newEnd)) {
      return;
    }
    event.start = ns;
    event.end = eventTimesChangedEvent.newEnd;
    this.events = [...this.events];
    const y = ns.getFullYear();
    const m = (ns.getMonth() + 1).toString().padStart(2, '0');
    const d = ns.getDate().toString().padStart(2, '0');
    const h = ns.getHours().toString().padStart(2, '0');
    const min = ns.getMinutes().toString().padStart(2, '0');
    this.appointmentService
      .updateAppointment({ ...appt, date: `${y}-${m}-${d}`, time: `${h}:${min}` }, appt.id)
      .subscribe({ next: () => this.getAllAppointmentsById() });
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery = value.toLowerCase();
  }

  cancelAppointment(appointment: any): void {
    const name = appointment.patient?.name
      ? `${appointment.patient.name} ${appointment.patient.lastname || ''}`.trim()
      : 'esta cita';
    if (!window.confirm(`¿Cancelar la cita de ${name}?`)) return;
    this.appointmentService.cancelAppointment(appointment.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.getAllAppointmentsById(),
        error: (err) => console.error('Error cancelling appointment:', err),
      });
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
