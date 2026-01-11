import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NewAppointmentComponent } from '../appointments/new-appointment/new-appointment.component';

@Component({
    selector: 'app-quickaction-menu',
    templateUrl: './quickaction-menu.component.html',
    styleUrls: ['./quickaction-menu.component.css'],
    standalone: false
})
export class QuickactionMenuComponent {
  constructor(
    private dialog: MatDialog,
    private router: Router
  ) {}

  openNewAppointmentDialog(): void {
    this.dialog.open(NewAppointmentComponent, {
      width: '800px'
    });
  }

  navigateToPatients(): void {
    this.router.navigate(['/patients']);
  }

  navigateToCalendar(): void {
    this.router.navigate(['/appointments']);
  }

  navigateToClinics(): void {
    this.router.navigate(['/clinics']);
  }

  navigateToPrescriptions(): void {
    this.router.navigate(['/prescriptions']);
  }
}
