import {
  Component,
  EventEmitter,
  inject,
  Output,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.css'],
  standalone: false,
})
export class EditModalComponent implements OnInit, AfterViewInit {
  inputData: { [key: string]: any } = inject(MAT_DIALOG_DATA);
  form: FormGroup;
  pickerRefs: { [key: string]: any } = {};
  @Output() formSubmitted = new EventEmitter<any>();

  constructor(private dialog: MatDialog, private fb: FormBuilder) {
    this.form = this.fb.group({});
  }

  ngOnInit(): void {
    const group: any = {};
    if (Array.isArray(this.inputData['fields'])) {
      this.inputData['fields'].forEach((field: any) => {
        group[field.key] = new FormControl(
          { value: field.value, disabled: field.disabled || false },
          field.validators || []
        );
      });
    }
    this.form = new FormGroup(group);
  }

  ngAfterViewInit(): void {
    // Dynamically assign picker references after view init
    if (Array.isArray(this.inputData['fields'])) {
      this.inputData['fields'].forEach((field: any) => {
        if (field.type === 'date') {
          this.pickerRefs[field.key] = 'picker_' + field.key;
        }
      });
    }
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.form.valid) {
      this.formSubmitted.emit(this.form.value);
      console.log('Form Submitted:', this.form.value);
      console.log('Event:', event);
    }
  }
}
