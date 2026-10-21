import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

import { NewPatientComponent } from './new-patient.component';

describe('NewPatientComponent', () => {
  let component: NewPatientComponent;
  let fixture: ComponentFixture<NewPatientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewPatientComponent],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatProgressSpinnerModule,
        MatButtonModule,
      ],
      providers: [provideMockStore()],
    });
    fixture = TestBed.createComponent(NewPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});