import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AppointmentsService } from './appointments.service';

describe('AppointmentsService', () => {
  let service: AppointmentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AppointmentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});