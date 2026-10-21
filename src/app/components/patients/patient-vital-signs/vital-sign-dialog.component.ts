import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ClinicalDataService } from 'src/app/services/clinical-data.service';
import { IVitalSign } from 'src/app/entities/IVitalSign';

export interface VitalSignDialogData {
  patientDetailsId: number;
  vitalSign: IVitalSign | null;
}

@Component({
  selector: 'app-vital-sign-dialog',
  templateUrl: './vital-sign-dialog.component.html',
  styleUrls: ['./vital-sign-dialog.component.css'],
  standalone: false,
})
export class VitalSignDialogComponent implements OnInit {
  form: FormGroup;
  saving = false;
  isEdit: boolean;
  title: string;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<VitalSignDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VitalSignDialogData,
    private clinicalDataService: ClinicalDataService,
    private translate: TranslateService
  ) {
    this.isEdit = !!data.vitalSign;
    this.title = this.isEdit ? this.translate.instant('PATIENTS.VITAL_SIGN_EDIT_TITLE') : this.translate.instant('PATIENTS.VITAL_SIGN_NEW_TITLE');

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    this.form = this.fb.group({
      recordedDate: [now, Validators.required],
      recordedTime: [timeStr, Validators.required],
      systolicBP: [null],
      diastolicBP: [null],
      heartRate: [null],
      temperature: [null],
      respiratoryRate: [null],
      oxygenSaturation: [null],
      weight: [null],
      height: [null],
      bloodGlucose: [null],
      notes: [''],
    });
  }

  ngOnInit(): void {
    if (this.isEdit && this.data.vitalSign) {
      const vs = this.data.vitalSign;
      const dt = new Date(vs.recordedAt);
      const timeStr = `${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`;

      this.form.patchValue({
        recordedDate: dt,
        recordedTime: timeStr,
        systolicBP: vs.systolicBP,
        diastolicBP: vs.diastolicBP,
        heartRate: vs.heartRate,
        temperature: vs.temperature,
        respiratoryRate: vs.respiratoryRate,
        oxygenSaturation: vs.oxygenSaturation,
        weight: vs.weight,
        height: vs.height,
        bloodGlucose: vs.bloodGlucose,
        notes: vs.notes,
      });
    }
  }

  private buildRecordedAt(): Date {
    const date: Date = this.form.value.recordedDate;
    const time: string = this.form.value.recordedTime;
    if (!date || !time) return new Date();

    const [hours, minutes] = time.split(':').map(Number);
    const result = new Date(date);
    result.setHours(hours, minutes, 0, 0);
    return result;
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;

    const fv = this.form.value;
    const payload = {
      patientDetailsId: this.data.patientDetailsId,
      systolicBP: fv.systolicBP ? Number(fv.systolicBP) : null,
      diastolicBP: fv.diastolicBP ? Number(fv.diastolicBP) : null,
      heartRate: fv.heartRate ? Number(fv.heartRate) : null,
      temperature: fv.temperature ? Number(fv.temperature) : null,
      respiratoryRate: fv.respiratoryRate ? Number(fv.respiratoryRate) : null,
      oxygenSaturation: fv.oxygenSaturation ? Number(fv.oxygenSaturation) : null,
      weight: fv.weight ? Number(fv.weight) : null,
      height: fv.height ? Number(fv.height) : null,
      bloodGlucose: fv.bloodGlucose ? Number(fv.bloodGlucose) : null,
      notes: fv.notes || null,
      recordedAt: this.buildRecordedAt(),
    };

    const request = this.isEdit
      ? this.clinicalDataService.updateVitalSign(this.data.vitalSign!.id, payload)
      : this.clinicalDataService.createVitalSign(payload);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.dialogRef.close(true);
      },
      error: () => {
        this.saving = false;
      },
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
