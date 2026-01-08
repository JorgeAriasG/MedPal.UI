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
import { selectClinicId } from 'src/app/store/selectors/auth.selectors';
import { setClinic } from 'src/app/store/actions/auth.actions';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  currentAppointmentId: number | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private appointmentService: AppointmensService,
    private dialog: MatDialog,
    private clinicService: ClinicService,
    private store: Store
  ) {}

  ngOnInit() {
    this.store
      .select(selectClinicId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (clinicId) => {
          console.log('Clinic ID from store in appointments:', clinicId);
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
                    console.log(
                      'Setting default clinic from appointment component:',
                      clinics[0].id
                    );
                    this.store.dispatch(setClinic({ clinicId: clinics[0].id }));
                  }
                },
                error: (err) => {
                  console.error('Error fetching clinics:', err);
                },
              });
          }
        },
        error: (err) => {
          console.error('Error getting clinic ID from store:', err);
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addAppointmentToggle(): void {
    const dialogRef = this.dialog.open(NewAppointmentComponent, {
      width: '800px',
      data: this.inputData,
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        console.log(res);
        if (res) {
          this.getAllAppointmentsById();
        }
      });
  }

  getAllAppointmentsById(): void {
    if (!this.clinicId) {
      console.warn('Clinic ID is not set');
      return;
    }

    this.appointmentService
      .getAppointments(Number(this.clinicId))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any[]) => {
          this.appointments = response;
          this.events = this.appointments.map((appointment: any) => {
            const [year, month, day] = appointment.date.split('-').map(Number);
            const [hour, minute] = appointment.time.split(':').map(Number);

            return {
              start: new Date(year, month - 1, day, hour, minute),
              end: new Date(year, month - 1, day, hour, minute),
              title: appointment.patient.name || 'No Name',
              color: { primary: '#ad2121', secondary: '#FAE3E3' },
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
          console.log('Appointments:', this.appointments);
        },
        error: (error) => {
          console.error('Error fetching appointments:', error);
        },
      });
  }

  /**
   * Abre el modal de edición con la configuración del formulario
   */
  private openEditModal(appointment: any): void {
    this.currentAppointmentId = appointment.id;

    const dialogRef = this.dialog.open(EditModalComponent, {
      width: '600px',
      data: {
        entityType: 'appointment',
        data: {
          date: appointment.date,
          time: appointment.time,
          notes: appointment.notes,
          status: appointment.status,
          patientName: appointment.patient.name,
          patientLastname: appointment.patient.lastname,
        },
        title: 'Edit Appointment',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.onFormSubmitted(result);
      }
      this.currentAppointmentId = null;
    });
  }

  /**
   * Procesa los datos del formulario y actualiza la cita
   */
  onFormSubmitted(data: any): void {
    console.log('Form Data:', data);

    // Convertir datos al formato esperado por la API
    const dateStr =
      data.date instanceof Date
        ? data.date.toISOString().split('T')[0]
        : data.date;

    const timeStr =
      data.time instanceof Date
        ? data.time.toTimeString().substring(0, 5)
        : data.time;

    const [year, month, day] = dateStr.split('-').map(Number);
    const [hour, minute] = timeStr.split(':').map(Number);

    const updatedAppointment: IAppointment = {
      date: {
        year,
        month,
        day,
      },
      time: {
        hour,
        minute,
      },
      notes: data.notes || '',
      status: data.status || 'Scheduled',
      clinicId: this.clinicId || undefined,
    };

    this.appointmentService
      .updateAppointment(updatedAppointment, this.currentAppointmentId!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Appointment updated successfully:', response);
          this.getAllAppointmentsById();
        },
        error: (error) => {
          console.error('Error updating appointment:', error);
        },
      });
  }
}
