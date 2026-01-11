import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PrescriptionService } from 'src/app/services/prescription.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-validate-prescription',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './validate-prescription.component.html',
  styleUrl: './validate-prescription.component.css',
})
export class ValidatePrescriptionComponent implements OnInit {
  isValid: boolean | null = null;
  loading: boolean = true;
  prescriptionData: any = null;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private prescriptionService: PrescriptionService
  ) {}

  ngOnInit(): void {
    const code = this.route.snapshot.paramMap.get('code');
    if (code) {
      this.validate(code);
    } else {
      this.loading = false;
      this.errorMessage = 'No validation code provided.';
    }
  }

  validate(code: string) {
    this.prescriptionService.validatePrescription(code).subscribe({
      next: (res) => {
        this.loading = false;
        if (res && res.isValid) {
          this.isValid = true;
          this.prescriptionData = res.prescription;
        } else {
          this.isValid = false;
          this.errorMessage = 'Invalid or Expired Prescription Code.';
        }
      },
      error: (err) => {
        this.loading = false;
        this.isValid = false;
        this.errorMessage =
          'Unable to verify prescription. Please try again or contact the clinic.';
        console.error(err);
      },
    });
  }
}
