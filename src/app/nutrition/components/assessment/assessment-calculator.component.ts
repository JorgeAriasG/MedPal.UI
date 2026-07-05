import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NutritionalAssessmentService } from '../../services/nutritional-assessment.service';
import {
  INutritionalAssessment,
  BmrMethod,
  ActivityFactor,
  AssessmentGoal,
} from '../../models';

@Component({
  selector: 'app-assessment-calculator',
  templateUrl: './assessment-calculator.component.html',
  styleUrls: ['./assessment-calculator.component.css'],
  standalone: false,
})
export class AssessmentCalculatorComponent implements OnInit {
  @Input() patientDetailsId!: number;
  @Input() weight = 70;
  @Input() height = 1.7;
  @Input() age = 30;
  @Input() gender: 'male' | 'female' = 'male';

  form: FormGroup;
  result: INutritionalAssessment | null = null;

  methods: BmrMethod[] = ['mifflin-st-jeor', 'harris-benedict', 'world-health-org'];
  activityFactors: ActivityFactor[] = ['sedentary', 'light', 'moderate', 'active', 'very-active'];
  goals: AssessmentGoal[] = ['weight-loss', 'maintenance', 'weight-gain', 'muscle-gain'];

  calculatorOpen = true;

  constructor(
    private fb: FormBuilder,
    private assessmentService: NutritionalAssessmentService
  ) {
    this.form = this.fb.group({
      weight: [this.weight],
      height: [this.height],
      age: [this.age],
      gender: [this.gender],
      method: ['mifflin-st-jeor'],
      activityFactor: ['moderate'],
      goal: ['maintenance'],
    });
  }

  ngOnInit(): void {
    this.form.patchValue({
      weight: this.weight || 70,
      height: this.height || 1.7,
      age: this.age || 30,
      gender: this.gender || 'male',
    });
    this.calculate();
  }

  calculate(): void {
    const fv = this.form.value;
    this.result = this.assessmentService.runFullAssessment(
      Number(fv.weight),
      Number(fv.height),
      Number(fv.age),
      fv.gender,
      fv.activityFactor,
      fv.goal,
      fv.method
    );
    this.result.patientDetailsId = this.patientDetailsId;
  }

  getMethodLabel(m: BmrMethod): string {
    return { 'mifflin-st-jeor': 'Mifflin-St Jeor', 'harris-benedict': 'Harris-Benedict', 'world-health-org': 'WHO' }[m];
  }

  getActivityLabel(f: ActivityFactor): string {
    return { 'sedentary': 'Sedentario', 'light': 'Ligero', 'moderate': 'Moderado', 'active': 'Activo', 'very-active': 'Muy activo' }[f];
  }

  getGoalLabel(g: AssessmentGoal): string {
    return { 'weight-loss': 'Pérdida de peso', 'maintenance': 'Mantenimiento', 'weight-gain': 'Aumento de peso', 'muscle-gain': 'Ganancia muscular' }[g];
  }
}
