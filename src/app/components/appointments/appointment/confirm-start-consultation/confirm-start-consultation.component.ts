import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmDialogData {
  patientName: string;
  appointmentTime?: string;
}

export interface ConfirmDialogResult {
  confirmed: boolean;
  skipFuture: boolean;
}

@Component({
  selector: 'app-confirm-start-consultation',
  templateUrl: './confirm-start-consultation.component.html',
  styleUrls: ['./confirm-start-consultation.component.css'],
  standalone: false,
})
export class ConfirmStartConsultationComponent {
  skipFuture = false;

  constructor(
    public dialogRef: MatDialogRef<ConfirmStartConsultationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData,
  ) {}

  onConfirm(): void {
    this.dialogRef.close({ confirmed: true, skipFuture: this.skipFuture });
  }

  onCancel(): void {
    this.dialogRef.close({ confirmed: false, skipFuture: false });
  }
}
