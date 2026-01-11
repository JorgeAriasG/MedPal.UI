import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPrescription } from 'src/app/entities/IPrescription';
import { PrescriptionService } from 'src/app/services/prescription.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-prescription-detail',
  templateUrl: './prescription-detail.component.html',
  styleUrls: ['./prescription-detail.component.css'],
  standalone: false,
})
export class PrescriptionDetailComponent implements OnInit {
  prescription: IPrescription | null = null;
  qrCodeUrl: SafeUrl | null = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private prescriptionService: PrescriptionService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPrescription(+id);
    } else {
      this.error = 'Invalid ID';
      this.loading = false;
    }
  }

  loadPrescription(id: number) {
    this.prescriptionService.getPrescriptionById(id).subscribe({
      next: (data) => {
        this.prescription = data;
        this.loadQrCode(id);
      },
      error: (err) => {
        this.error = 'Failed to load prescription';
        this.loading = false;
        console.error(err);
      },
    });
  }

  loadQrCode(id: number) {
    this.prescriptionService.getPrescriptionQr(id).subscribe({
      next: (blob) => {
        const objectURL = URL.createObjectURL(blob);
        this.qrCodeUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load QR code', err);
        this.loading = false;
      },
    });
  }

  print() {
    window.print();
  }
}
