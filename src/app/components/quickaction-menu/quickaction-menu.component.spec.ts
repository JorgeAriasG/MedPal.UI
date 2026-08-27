import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { QuickactionMenuComponent } from './quickaction-menu.component';

describe('QuickactionMenuComponent', () => {
  let component: QuickactionMenuComponent;
  let fixture: ComponentFixture<QuickactionMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuickactionMenuComponent],
      imports: [RouterTestingModule, MatIconModule],
      providers: [{ provide: MatDialog, useValue: { open: jasmine.createSpy('open') } }],
    });
    fixture = TestBed.createComponent(QuickactionMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});