import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { IAnthropometry } from '../../models';
import { NutritionService } from '../../services/nutrition.service';

export interface AnthropometryDialogData {
  patientDetailsId: number;
  entry: IAnthropometry | null;
}

@Component({
  selector: 'app-anthropometry-dialog',
  templateUrl: './anthropometry-dialog.component.html',
  styleUrls: ['./anthropometry.component.css'],
  standalone: false,
})
export class AnthropometryDialogComponent implements OnInit {
  form: FormGroup;
  saving = false;
  isEdit: boolean;
  title: string;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AnthropometryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AnthropometryDialogData,
    private nutritionService: NutritionService,
    private translate: TranslateService
  ) {
    this.isEdit = !!data.entry;
    this.title = this.isEdit
      ? this.translate.instant('NUTRITION.ANTHRO_EDIT_TITLE')
      : this.translate.instant('NUTRITION.ANTHRO_NEW_TITLE');

    this.form = this.fb.group({
      recordedAt: [new Date()],
      weight: [null],
      height: [null],
      waist: [null],
      hip: [null],
      neck: [null],
      midArmCircumference: [null],
      wrist: [null],
      calf: [null],
      thigh: [null],
      tricepsSkinfold: [null],
      bicepsSkinfold: [null],
      subscapularSkinfold: [null],
      suprailiacSkinfold: [null],
      notes: [''],
    });
  }

  ngOnInit(): void {
    if (this.isEdit && this.data.entry) {
      const e = this.data.entry;
      this.form.patchValue({
        recordedAt: new Date(e.recordedAt),
        weight: e.weight,
        height: e.height,
        waist: e.waist,
        hip: e.hip,
        neck: e.neck,
        midArmCircumference: e.midArmCircumference,
        wrist: e.wrist,
        calf: e.calf,
        thigh: e.thigh,
        tricepsSkinfold: e.tricepsSkinfold,
        bicepsSkinfold: e.bicepsSkinfold,
        subscapularSkinfold: e.subscapularSkinfold,
        suprailiacSkinfold: e.suprailiacSkinfold,
        notes: e.notes,
      });
    }
  }

  private calculateBmi(weight: number, height: number): number {
    if (!weight || !height) return 0;
    return +(weight / (height * height)).toFixed(1);
  }

  private calculateWaistHipRatio(waist: number, hip: number): number {
    if (!waist || !hip) return 0;
    return +(waist / hip).toFixed(2);
  }

  private calculateWaistHeightRatio(waist: number, height: number): number {
    if (!waist || !height) return 0;
    return +(waist / (height * 100)).toFixed(2);
  }

  private estimateBodyFat(): number | undefined {
    const fv = this.form.value;
    const sumSkinfolds = (fv.tricepsSkinfold || 0) + (fv.bicepsSkinfold || 0)
      + (fv.subscapularSkinfold || 0) + (fv.suprailiacSkinfold || 0);
    if (sumSkinfolds <= 0) return undefined;

    const density = 1.1422 - 0.0544 * Math.log10(sumSkinfolds);
    return +((4.95 / density - 4.5) * 100).toFixed(1);
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;

    const fv = this.form.value;
    const weight = Number(fv.weight);
    const height = Number(fv.height);

    const payload: IAnthropometry = {
      patientDetailsId: this.data.patientDetailsId,
      recordedAt: fv.recordedAt,
      weight,
      height,
      bmi: this.calculateBmi(weight, height),
      waist: fv.waist ? Number(fv.waist) : undefined,
      hip: fv.hip ? Number(fv.hip) : undefined,
      waistHipRatio: this.calculateWaistHipRatio(
        Number(fv.waist), Number(fv.hip)
      ) || undefined,
      waistHeightRatio: this.calculateWaistHeightRatio(
        Number(fv.waist), height
      ) || undefined,
      neck: fv.neck ? Number(fv.neck) : undefined,
      midArmCircumference: fv.midArmCircumference ? Number(fv.midArmCircumference) : undefined,
      wrist: fv.wrist ? Number(fv.wrist) : undefined,
      calf: fv.calf ? Number(fv.calf) : undefined,
      thigh: fv.thigh ? Number(fv.thigh) : undefined,
      tricepsSkinfold: fv.tricepsSkinfold ? Number(fv.tricepsSkinfold) : undefined,
      bicepsSkinfold: fv.bicepsSkinfold ? Number(fv.bicepsSkinfold) : undefined,
      subscapularSkinfold: fv.subscapularSkinfold ? Number(fv.subscapularSkinfold) : undefined,
      suprailiacSkinfold: fv.suprailiacSkinfold ? Number(fv.suprailiacSkinfold) : undefined,
      bodyFatPercentageEstimated: this.estimateBodyFat(),
      notes: fv.notes || undefined,
    };

    const request = this.isEdit
      ? this.nutritionService.updateAnthropometry(this.data.entry!.id!, payload)
      : this.nutritionService.saveAnthropometry(payload);

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
