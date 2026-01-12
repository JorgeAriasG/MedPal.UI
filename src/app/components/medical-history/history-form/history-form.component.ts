import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MedicalHistoryService } from 'src/app/services/medical-history.service';
import { MedicalHistoryWriteDTO } from 'src/app/entities/medical-history.model';
import {
  SpecialtyType,
  SpecialtyDataType,
} from 'src/app/entities/specialty-templates.model';

export interface HistoryFormData {
  patientDetailsId: number; // Changed from patientId to match API
  userSpecialty: SpecialtyType;
}

@Component({
  selector: 'app-history-form',
  templateUrl: './history-form.component.html',
  styleUrls: ['./history-form.component.css'],
  standalone: false,
})
export class HistoryFormComponent implements OnInit {
  historyForm: FormGroup;
  specialtyType: SpecialtyType;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private medicalHistoryService: MedicalHistoryService,
    private dialogRef: MatDialogRef<HistoryFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HistoryFormData
  ) {
    // Use specialty from data with fallback to General
    this.specialtyType = (data.userSpecialty as SpecialtyType) || 'General';

    console.log('HistoryForm initialized with specialty:', this.specialtyType);

    this.historyForm = this.fb.group({
      diagnosis: ['', Validators.required],
      diagnosisDate: [new Date().toISOString().split('T')[0], Validators.required],
      clinicalNotes: ['', Validators.required],
      followUpDate: [''],
      specialtyData: [null], // Will be populated by the specialty template component
      isConfidential: [true],
    });
  }

  ngOnInit(): void {
    // Initialize specialty data based on type
    console.log('ngOnInit - specialty type:', this.specialtyType);

    if (this.specialtyType === 'Dental') {
      this.historyForm.patchValue({
        specialtyData: { teeth: {}, observations: '' },
      });
    } else if (this.specialtyType === 'Nutrición') {
      this.historyForm.patchValue({
        specialtyData: {
          peso: 0,
          altura: 0,
          imc: 0,
          objetivo: '',
          restricciones: [],
          caloriasDiarias: 0,
        },
      });
    } else {
      this.historyForm.patchValue({
        specialtyData: { customData: '' },
      });
    }
  }

  onSubmit(): void {
    if (this.historyForm.invalid) {
      this.errorMessage = 'Por favor complete todos los campos requeridos';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const formValue = this.historyForm.value;
    const specialtyDataJson = this.medicalHistoryService.serializeSpecialtyData(
      formValue.specialtyData
    );

    // Create DTO matching backend API expectations
    const dto: MedicalHistoryWriteDTO = {
      patientDetailsId: this.data.patientDetailsId,
      specialtyType: this.specialtyType,
      diagnosis: formValue.diagnosis,
      diagnosisDate: formValue.diagnosisDate,
      clinicalNotes: formValue.clinicalNotes,
      followUpDate: formValue.followUpDate || undefined,
      specialtyData: specialtyDataJson || undefined,
      isConfidential: formValue.isConfidential || true,
    };

    console.log('Submitting medical history:', dto);

    this.medicalHistoryService.createHistory(dto).subscribe({
      next: (result) => {
        this.loading = false;
        this.dialogRef.close(result);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage =
          'Error al guardar el historial médico. Por favor intente nuevamente.';
        console.error('Error creating medical history:', error);
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
