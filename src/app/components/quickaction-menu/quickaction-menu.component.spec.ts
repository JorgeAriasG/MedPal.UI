import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickactionMenuComponent } from './quickaction-menu.component';

describe('QuickactionMenuComponent', () => {
  let component: QuickactionMenuComponent;
  let fixture: ComponentFixture<QuickactionMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuickactionMenuComponent]
    });
    fixture = TestBed.createComponent(QuickactionMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
