import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddClinicComponent } from '../add-clinic/add-clinic.component';
import { ClinicService } from '../services/clinic.service';
import { IClinic } from 'src/app/entities/IClinic';

@Component({
  selector: 'app-clinic-list',
  templateUrl: './clinic-list.component.html',
  styleUrls: ['./clinic-list.component.css']
})
export class ClinicListComponent {
  displayedColumns: string[] = ['clinicName', 'location', 'contactInfo', 'actions'];
  clinics: IClinic[] = [];
  isEdit: boolean = false;

  constructor(private dialog: MatDialog, private clinicService: ClinicService){}

  ngOnInit() {
    this.getClinics();
  }

  addClinicToggle(): void {
    this.dialog.open(AddClinicComponent, {width: '400px'});
    this.dialog.afterAllClosed.subscribe(res => {
      console.log(res);
      this.getClinics();
    });
  }

  async getClinics(): Promise<void> {
    try {
      await this.clinicService.getClinics().subscribe(clinics => {
        console.log('Clinics', clinics);
        this.clinics = clinics;
      });
    } catch(error) {
      console.error(error);
    }
  }

  editClinic(clinic: IClinic): void {
    this.isEdit = true;
    this.dialog.open(AddClinicComponent, {width: '400px', data: [clinic, this.isEdit]})
  }

  deleteClinic(id: number):void {

  }

}
