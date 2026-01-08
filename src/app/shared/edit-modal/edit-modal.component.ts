import {
  Component,
  inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { formConfigMap, FormFieldConfig } from 'src/app/conf/form-config';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.css'],
  standalone: false,
})
export class EditModalComponent implements OnInit, OnDestroy {
  inputData: any = inject(MAT_DIALOG_DATA);
  form: FormGroup;
  fields: any[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditModalComponent>
  ) {
    this.form = this.fb.group({});
  }

  ngOnInit(): void {
    try {
      if (
        this.inputData?.entityType &&
        formConfigMap[this.inputData.entityType as keyof typeof formConfigMap]
      ) {
        const config =
          formConfigMap[
            this.inputData.entityType as keyof typeof formConfigMap
          ];
        this.buildFormFromConfig(config, this.inputData.data || this.inputData);
      } else if (this.inputData?.fields) {
        this.buildFormFromFields(this.inputData.fields);
      } else {
        this.buildFormAuto(this.inputData);
      }
    } catch (error) {
      console.error('Error initializing form:', error);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Construye el formulario desde la configuración definida
   */
  private buildFormFromConfig(config: Record<string, FormFieldConfig>, data: any): void {
    const group: any = {};

    for (const [key, fieldConfig] of Object.entries(config)) {
      try {
        const initialValue = fieldConfig.value || '';
        const validators = fieldConfig.validators
          ? Array.isArray(fieldConfig.validators)
            ? fieldConfig.validators
            : [fieldConfig.validators]
          : [];

        const fieldValue =
          data && data[key] !== undefined ? data[key] : initialValue;
        const isDisabled = data && data[key] && key === 'clinic' ? true : false;

        // Crear el control con disabled en el constructor
        group[key] = new FormControl(
          { value: fieldValue, disabled: isDisabled },
          validators
        );

        // Usar la metadata de la configuración directamente
        const field: any = {
          key,
          label: this.formatLabel(key),
          ...fieldConfig,
          value: fieldValue,
          disabled: isDisabled,
        };

        this.fields.push(field);
      } catch (error) {
        console.error(`Error processing field ${key}:`, error);
      }
    }

    this.form = new FormGroup(group);
    console.log('Form created from config:', Object.keys(this.form.controls));
  }

  /**
   * Construye el formulario desde campos explícitos
   */
  private buildFormFromFields(fields: any[]): void {
    const group: any = {};

    fields.forEach((field: any) => {
      try {
        const isDisabled = field.disabled === true || field.disabled === 'disabled';

        group[field.key] = new FormControl(
          { value: field.value, disabled: isDisabled },
          field.validators || []
        );

        const processedField = {
          ...field,
          disabled: isDisabled,
          options: field.options || [],
        };

        this.fields.push(processedField);
      } catch (error) {
        console.error(`Error processing field ${field.key}:`, error);
      }
    });

    this.form = new FormGroup(group);
    console.log('Form created from fields:', Object.keys(this.form.controls));
  }

  /**
   * Construye el formulario automáticamente desde los datos
   * Fallback para datos no configurados
   */
  private buildFormAuto(data: any): void {
    const excludeKeys = [
      'id',
      'password',
      'passwordHash',
      'clinic',
      'fields',
      'title',
      'entityType',
      'data',
      'patient',
      'user',
    ];
    const group: any = {};

    for (const key in data) {
      if (data.hasOwnProperty(key) && !excludeKeys.includes(key)) {
        try {
          group[key] = new FormControl(
            { value: data[key], disabled: false },
            []
          );

          // Inferir tipo basado en el nombre del campo
          const fieldType = this.inferFieldType(key);

          const field: any = {
            key,
            label: this.formatLabel(key),
            type: fieldType,
            value: data[key],
            disabled: false,
            options: fieldType === 'select' ? this.getSelectOptions(key) : [],
          };

          this.fields.push(field);
        } catch (error) {
          console.error(`Error processing field ${key}:`, error);
        }
      }
    }

    this.form = new FormGroup(group);
    console.log('Form created auto:', Object.keys(this.form.controls));
  }

  private formatLabel(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  }

  /**
   * Infiere el tipo de campo basado en el nombre (solo para buildFormAuto)
   */
  private inferFieldType(key: string): string {
    const lowerKey = key.toLowerCase();

    if (lowerKey.includes('email')) return 'email';
    if (
      lowerKey.includes('date') ||
      lowerKey.includes('dob') ||
      lowerKey.includes('birth')
    )
      return 'date';
    if (lowerKey.includes('time')) return 'time';
    if (lowerKey.includes('phone')) return 'tel';
    if (lowerKey.includes('gender') || lowerKey.includes('status'))
      return 'select';

    return 'text';
  }

  /**
   * Obtiene opciones predeterminadas para campos select (solo para buildFormAuto)
   */
  private getSelectOptions(key: string): any[] {
    const lowerKey = key.toLowerCase();

    if (lowerKey.includes('gender')) {
      return [
        { label: 'Male', value: 'M' },
        { label: 'Female', value: 'F' },
        { label: 'Other', value: 'O' },
      ];
    }

    if (lowerKey.includes('status')) {
      return [
        { label: 'Pending', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Completed', value: 'completed' },
      ];
    }

    return [
      { label: 'Yes', value: true },
      { label: 'No', value: false },
    ];
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.form.valid) {
      const formValue = this.form.getRawValue();
      this.dialogRef.close(formValue);
    } else {
      console.warn('Form is invalid:', this.form.errors);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
