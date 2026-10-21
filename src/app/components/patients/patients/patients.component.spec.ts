import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { PatientsComponent } from './patients.component';

describe('PacientComponent', () => {
  let component: PatientsComponent;
  let fixture: ComponentFixture<PatientsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PatientsComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        MatIconModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatDialogModule,
      ],
      providers: [
        provideMockStore(),
        provideNoopAnimations(),
      ],
    });
    fixture = TestBed.createComponent(PatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});