import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { MedicalHistoryService } from 'src/app/services/medical-history.service';
import { MedicalHistoryWriteDTO } from 'src/app/entities/medical-history.model';
import {
  SpecialtyType,
  SpecialtyDataType,
} from 'src/app/entities/specialty-templates.model';
import { SPECIALTY_CONFIG, SoapConfig } from 'src/app/config/specialty-config';

export interface HistoryFormData {
  patientDetailsId: number;
  userSpecialty: SpecialtyType;
}

@Component({
  selector: 'app-history-form',
  templateUrl: './history-form.component.html',
  styleUrls: ['./history-form.component.css'],
  standalone: false,
})
export class HistoryFormComponent implements OnInit, OnDestroy {
  historyForm: FormGroup;
  specialtyType: SpecialtyType;
  config: SoapConfig;
  loading = false;
  errorMessage = '';
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private medicalHistoryService: MedicalHistoryService,
    private dialogRef: MatDialogRef<HistoryFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HistoryFormData,
    private translate: TranslateService
  ) {
    this.specialtyType = (data.userSpecialty as SpecialtyType) || 'General';
    this.config = SPECIALTY_CONFIG[this.specialtyType] || SPECIALTY_CONFIG.General;

    this.historyForm = this.fb.group({
      diagnosis: ['', Validators.required],
      diagnosisDate: [new Date().toISOString().split('T')[0], Validators.required],
      clinicalNotes: ['', Validators.required],
      followUpDate: [''],
      cie10Codes: [''],
      specialtyData: [null],
      isConfidential: [true],
    });
  }

  ngOnInit(): void {
    if (this.config.template === 'dental') {
      this.historyForm.patchValue({
        specialtyData: { teeth: {}, observations: '' },
      });
    } else if (this.config.template === 'nutrition') {
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
    } else if (this.config.template === 'soap') {
      this.historyForm.patchValue({
        specialtyData: {
          subjective: '',
          objective: '',
          assessment: '',
          plan: '',
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
      this.errorMessage = this.translate.instant('MEDICAL_HISTORY.FORM_ERROR_REQUIRED');
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const formValue = this.historyForm.value;
    const specialtyDataJson = this.medicalHistoryService.serializeSpecialtyData(
      formValue.specialtyData
    );

    const dto: MedicalHistoryWriteDTO = {
      patientDetailsId: this.data.patientDetailsId,
      specialtyType: this.specialtyType,
      diagnosis: formValue.diagnosis,
      diagnosisDate: formValue.diagnosisDate,
      clinicalNotes: formValue.clinicalNotes,
      followUpDate: formValue.followUpDate || undefined,
      specialtyData: specialtyDataJson || undefined,
      cie10Codes: formValue.cie10Codes || undefined,
      isConfidential: formValue.isConfidential || true,
    };

    this.medicalHistoryService.createHistory(dto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.loading = false;
          this.dialogRef.close(result);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = this.translate.instant('MEDICAL_HISTORY.FORM_ERROR_SAVE');
          console.error('Error creating medical history:', error);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
