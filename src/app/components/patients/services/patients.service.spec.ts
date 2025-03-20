import { TestBed } from '@angular/core/testing';

import { PacientsService } from './patients.service';

describe('PacientsService', () => {
  let service: PacientsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PacientsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
