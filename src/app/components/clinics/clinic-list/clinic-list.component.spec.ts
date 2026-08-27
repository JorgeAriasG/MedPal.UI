import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { ClinicListComponent } from './clinic-list.component';

describe('ClinicListComponent', () => {
  let component: ClinicListComponent;
  let fixture: ComponentFixture<ClinicListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClinicListComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        MatIconModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatDialogModule,
      ],
      providers: [provideMockStore(), provideNoopAnimations()],
    });
    fixture = TestBed.createComponent(ClinicListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});