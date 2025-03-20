import { TestBed } from '@angular/core/testing';

import { AppointmensService } from './appointmens.service';

describe('AppointmensService', () => {
  let service: AppointmensService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppointmensService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
