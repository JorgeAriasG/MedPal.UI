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

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent {
  faPencil = faPencil
  appointments: any;
  clinicId: number = 2;
  inputData: IInputData = {
    isEditable: false,
    data: {}
  }


  constructor(private appointmentService: AppointmensService, private dialog: MatDialog) { }

  ngOnInit() {
    this.getAllAppointmentsById();
  }

  addAppointmentToggle(): void {
        this.dialog.open(NewAppointmentComponent, {width: '800px', data: this.inputData });
        this.dialog.afterAllClosed.subscribe(res => {
          console.log(res);
          // this.getClinics();
        });
  }

  async getAllAppointmentsById() {
    try {
      await this.appointmentService.getAppointments(this.clinicId).subscribe((response: any) => {
        this.appointments = response;
        console.log('Appointments:', this.appointments);
      });
    } catch (error) {
      console.error('Error fetching appointments:' , error);
    }
  }

}
