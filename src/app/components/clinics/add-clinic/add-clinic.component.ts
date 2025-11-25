import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Component, inject } from '@angular/core';
import { IClinic } from 'src/app/entities/IClinic';
import { ClinicService } from '../services/clinic.service';

@Component({
    selector: 'app-add-clinic',
    templateUrl: './add-clinic.component.html',
    styleUrls: ['./add-clinic.component.css'],
    standalone: false
})
export class AddClinicComponent {
  data = inject(MAT_DIALOG_DATA);
  isEdit: boolean = false;
  clinic: IClinic = {
    id: null,
    name: '',
    location: '',
    contactInfo: '',
    open: { hour: 0, minute: 0 },
    close: { hour: 0, minute: 0 }
  };

  constructor(private clinicService: ClinicService, private dialog: MatDialog){
    this.dialog.afterOpened.subscribe(res => {
      this.clinic = this.data[0];
      this.isEdit = this.data[0];
      console.log('afterOpened' , this.data);
    });
  }

  ngOnInit() {
    this.dialog.afterOpened.subscribe(res => {
      console.log('afterOpened' , res);
    });
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if(this.isEdit) {
      this.editClinic();
    } else {
      this.addClinic();
    }
  }

  private toHourMinute(value: any): { hour: number; minute: number } {
    if (!value) {
      return { hour: 0, minute: 0 };
    }
    // Si el picker devuelve un objeto {hour, minute}
    if (typeof value === 'object' && value.hour != null && value.minute != null) {
      return { hour: Number(value.hour), minute: Number(value.minute) };
    }
    // Si el picker devuelve una cadena "HH:mm" o "HH:mm:ss"
    if (typeof value === 'string') {
      const parts = value.split(':').map(p => Number(p));
      return { hour: parts[0] || 0, minute: parts[1] || 0 };
    }
    // Si el picker devuelve un Date
    if (value instanceof Date) {
      return { hour: value.getHours(), minute: value.getMinutes() };
    }
    // fallback
    return { hour: 0, minute: 0 };
  }

  async addClinic(): Promise<void> {
    try {
      const payload = {
        ...this.clinic,
        open: this.toHourMinute(this.clinic.open),
        close: this.toHourMinute(this.clinic.close),
      };
      await this.clinicService.addClinic(payload).subscribe(res => {
        this.dialog.closeAll();
        console.log(res);
      });
    } catch(error) {
      console.error(error);
    }
  }

  async editClinic(): Promise<void> {
    try {
      const payload = {
        ...this.clinic,
        open: this.toHourMinute(this.clinic.open),
        close: this.toHourMinute(this.clinic.close),
      };
      await this.clinicService.editClinic(payload).subscribe(res => {
        console.log(res);
        this.dialog.closeAll();
      });
    } catch(error) {
      console.error(error);
    }
  }

}
