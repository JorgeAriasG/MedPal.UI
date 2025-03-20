import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-edit-modal',
    templateUrl: './edit-modal.component.html',
    styleUrls: ['./edit-modal.component.css'],
    standalone: false
})
export class EditModalComponent {
  inputData: { [key: string]: any } = inject(MAT_DIALOG_DATA)['data'];
  form: FormGroup;
  formInputs: string[] = [];
  @Output() formSubmmited = new EventEmitter<any>();

  constructor(private dialog: MatDialog, private fb: FormBuilder) {
    this.form = this.fb.group({});
  }

  ngOnInit(): void {
    this.initializeFormControls(this.inputData);
    console.log('Form Inputs:', this.formInputs);
  }

  initializeFormControls(data: any, parentKey: string = ''): void {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const controlKey = parentKey ? `${key}` : key;
        if (typeof data[key] === 'object' && data[key] !== null) {
          this.initializeFormControls(data[key], controlKey);
        } else {
          this.form.addControl(controlKey, this.fb.control(data[key], Validators.required));
          this.formInputs.push(controlKey); // Add the control key to formInputs
        }
      }
    }
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.form.valid) {
      this.formSubmmited.emit(this.form.value);
      console.log('Form Submitted:', this.form.value);
    }
  }
}
