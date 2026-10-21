import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { AddClinicComponent } from './add-clinic.component';

describe('AddClinicComponent', () => {
  let component: AddClinicComponent;
  let fixture: ComponentFixture<AddClinicComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddClinicComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatTimepickerModule,
        MatNativeDateModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatSnackBar, useValue: { open: jasmine.createSpy('open') } },
        provideMockStore(),
      ],
    });
    fixture = TestBed.createComponent(AddClinicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});