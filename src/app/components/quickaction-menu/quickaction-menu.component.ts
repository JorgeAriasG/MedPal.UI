import { Component, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewAppointmentComponent } from '../appointments/new-appointment/new-appointment.component';

@Component({
  selector: 'app-quickaction-menu',
  templateUrl: './quickaction-menu.component.html',
  styleUrls: ['./quickaction-menu.component.css']
})
export class QuickactionMenuComponent {
  constructor(private dialog: MatDialog) {}

  openDialog(): void {
    this.dialog.open(NewAppointmentComponent, {
      width: '400px'
    });
  }
}
