import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngrx/store';

import { CompleteRegistrationComponent } from './complete-registration.component';
import { BookingService } from 'src/app/services/booking.service';
import { AuthService } from 'src/app/services/auth.service';

describe('CompleteRegistrationComponent', () => {
  let component: CompleteRegistrationComponent;
  let fixture: ComponentFixture<CompleteRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompleteRegistrationComponent],
      imports: [ReactiveFormsModule, MatCardModule, TranslateModule.forRoot()],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: { get: () => null },
            },
          },
        },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: BookingService, useValue: { completeRegistration: jasmine.createSpy('completeRegistration') } },
        { provide: MatSnackBar, useValue: { open: jasmine.createSpy('open') } },
        { provide: AuthService, useValue: { persistAuth: jasmine.createSpy('persistAuth') } },
        { provide: Store, useValue: { dispatch: jasmine.createSpy('dispatch') } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CompleteRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
