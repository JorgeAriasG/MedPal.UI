import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { appointmentFormConfig, patientFormConfig } from 'src/app/conf/form-config';
import { createFormGroupFromConfig } from 'src/app/shared/utils/form-utils';

@Component({
    selector: 'app-new-appointment',
    templateUrl: './new-appointment.component.html',
    styleUrls: ['./new-appointment.component.css'],
    standalone: false
})
export class NewAppointmentComponent {
  // @Output() closedDialog = new EventEmitter<void>();
  appointmentForm: FormGroup;
  patientForm: FormGroup;

  constructor(private matDialog: MatDialog, private fb: FormBuilder){
    this.patientForm = createFormGroupFromConfig(this.fb, patientFormConfig);
    this.appointmentForm = createFormGroupFromConfig(this.fb, appointmentFormConfig);
    console.log('Patient form:', this.patientForm);
    console.log('Appointment form:', this.appointmentForm);
    this.patientForm.get('lastname')?.disable();
    this.patientForm.get('email')?.disable();
    this.patientForm.get('phone')?.disable();
  }

  closeDialog(): void {
    this.matDialog.closeAll();
  }

  saveAppointment(): void {
    console.log('Appointment saved: ' , this.appointmentForm.controls);
  }

}
