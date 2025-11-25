import { on } from '@ngrx/store';
import { IAppointment } from './../../../entities/IAppointment';
import { Component } from '@angular/core';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { AppointmensService } from '../services/appointmens.service';
import { MatDialog } from '@angular/material/dialog';
import { NewAppointmentComponent } from '../new-appointment/new-appointment.component';
import { EditModalComponent } from 'src/app/shared/edit-modal/edit-modal.component';
import { IInputData } from 'src/app/entities/IInputData';
import { AppointmentModel } from 'src/app/entities/AppointmentModel';
import { IPatient } from 'src/app/entities/IPatient';
import { SessionService } from 'src/app/utils/session/session.service';
import { CalendarEvent } from 'calendar-utils';
import { Validators } from '@angular/forms';
import { icon } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css'],
  standalone: false,
})
export class AppointmentComponent {
  faPencil = faPencil;
  appointments: any;
  clinicId: number | null | undefined;
  inputData: IInputData = {
    isEditable: false,
    data: {},
  };
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  currentAppointmentId: number | null = null;

  constructor(
    private appointmentService: AppointmensService,
    private dialog: MatDialog,
    private session: SessionService
  ) {}

  ngOnInit() {
    this.getClinicId();
  }

  addAppointmentToggle(): void {
    this.dialog.open(NewAppointmentComponent, {
      width: '800px',
      data: this.inputData,
    });
    this.dialog.afterAllClosed.subscribe((res) => {
      console.log(res);
      // this.getClinics();
    });
  }

  getClinicId(): void {
    this.session.getClinicId().subscribe({
      next: (clinicId) => {
        console.log('Clinic ID:', clinicId);
        this.clinicId = clinicId;
        this.getAllAppointmentsById();
      },
      error: (err) => {
        console.error('Error fetching clinic ID:', err);
      },
    });
  }

  async getAllAppointmentsById() {
    try {
      await this.appointmentService
        .getAppointments(Number(this.clinicId))
        .subscribe((response: any) => {
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
                    this.currentAppointmentId = appointment.id;
                    this.inputData.isEditable = true;
                    this.inputData.data = {
                      name: appointment.patient.name,
                      lastname: appointment.patient.lastname,
                      date: appointment.date,
                      time: appointment.time,
                    };
                    console.log('Input Data:', this.inputData);
                    const editConfig = {
                      title: 'Edit Appointment',
                      fields: [
                        {
                          key: 'name',
                          label: 'Name',
                          type: 'text',
                          value: appointment.patient.name,
                          validators: [Validators.required],
                          disabled: true,
                        },
                        {
                          key: 'lastname',
                          label: 'Lastname',
                          type: 'text',
                          value: appointment.patient.lastname,
                          disabled: true,
                        },
                        {
                          key: 'date',
                          label: 'Date',
                          type: 'date',
                          value: appointment.date,
                        },
                        {
                          key: 'time',
                          label: 'Time',
                          type: 'time',
                          value: appointment.time,
                        },
                        {
                          key: 'notes',
                          label: 'Notes',
                          type: 'textarea',
                          value: appointment.notes,
                        },
                      ],
                    };
                    const dialogRef = this.dialog.open(EditModalComponent, {
                      data: editConfig,
                    });
                    dialogRef.componentInstance.formSubmitted.subscribe(
                      (formData) => {
                        this.onFormSubmitted(formData);
                      }
                    );
                  },
                },
              ],
            };
          });
          console.log('Appointments:', this.appointments);
        });
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  }
  onFormSubmitted(data: any): void {
    console.log('Form Data:', data);

    const updatedAppointment: IAppointment = {
      date: data.date ? data.date.toISOString().split('T')[0] : '',
      // TODO: FIX time and date format before stored to backend (should be HH:mm) and local timezone
      time: data.time ? data.time.split('T')[1].substring(0, 5) : '',
      notes: data.notes || '',
      status: 'Scheduled',
    };
    this.appointmentService
      .updateAppointment(updatedAppointment, this.currentAppointmentId!)
      .subscribe({
        next: (response) => {
          console.log('Appointment updated successfully:', response);
          this.getAllAppointmentsById();
        },
        error: (error) => {
          console.error('Error updating appointment:', error);
        },
      });
    this.currentAppointmentId = null;
  }
}
