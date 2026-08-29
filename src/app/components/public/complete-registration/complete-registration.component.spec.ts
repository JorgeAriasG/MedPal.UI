import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { CompleteRegistrationComponent } from './complete-registration.component';
import { BookingService } from 'src/app/services/booking.service';

describe('CompleteRegistrationComponent', () => {
  let component: CompleteRegistrationComponent;
  let fixture: ComponentFixture<CompleteRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompleteRegistrationComponent],
      imports: [ReactiveFormsModule, MatCardModule],
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
        { provide: BookingService, useValue: {} },
        { provide: MatSnackBar, useValue: { open: jasmine.createSpy('open') } },
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