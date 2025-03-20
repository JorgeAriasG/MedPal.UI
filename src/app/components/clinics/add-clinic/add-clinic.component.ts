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

  async addClinic(): Promise<void> {
    try {
      await this.clinicService.addClinic(this.clinic).subscribe(res => {
        this.dialog.closeAll();
        console.log(res);
      })
    } catch(error) {
      console.error(error);
    }
  }

  async editClinic(): Promise<void> {
    try {
      await this.clinicService.editClinic(this.clinic).subscribe(res => {
        console.log(res);
      });
    } catch(error) {
      console.error(error);
    }
  }

}
