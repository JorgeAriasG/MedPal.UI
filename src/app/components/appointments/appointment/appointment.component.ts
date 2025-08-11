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

@Component({
    selector: 'app-appointment',
    templateUrl: './appointment.component.html',
    styleUrls: ['./appointment.component.css'],
    standalone: false
})
export class AppointmentComponent {
  faPencil = faPencil
  appointments: any;
  clinicId: string | null | undefined;
  inputData: IInputData = {
    isEditable: false,
    data: {}
  }


  constructor(private appointmentService: AppointmensService, private dialog: MatDialog, private session: SessionService) { }

  ngOnInit() {
    this.getClinicId();
  }

  addAppointmentToggle(): void {
        this.dialog.open(NewAppointmentComponent, {width: '800px', data: this.inputData });
        this.dialog.afterAllClosed.subscribe(res => {
          console.log(res);
          // this.getClinics();
        });
  }

  getClinicId(): void {
    this.session.getClinicId().subscribe({
      next: clinicId => {
        console.log('Clinic ID:', clinicId);
        this.clinicId = clinicId;
        this.getAllAppointmentsById();
      },
      error: err => {
        console.error('Error fetching clinic ID:', err);
      }});
  }

  async getAllAppointmentsById() {
    try {
      await this.appointmentService.getAppointments(Number(this.clinicId)).subscribe((response: any) => {
        this.appointments = response;
        console.log('Appointments:', this.appointments);
      });
    } catch (error) {
      console.error('Error fetching appointments:' , error);
    }
  }

}
