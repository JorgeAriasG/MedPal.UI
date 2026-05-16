import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthState } from 'src/app/store/reducers/auth.reducer';
import { logout } from 'src/app/store/actions/auth.actions';
import { UiService } from 'src/app/services/ui.service';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css'],
    standalone: false
})
export class MenuComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isCollapsed = false;
  private destroy$ = new Subject<void>();

  constructor( 
    private router: Router, 
    private store: Store<{ auth: AuthState }>,
    private uiService: UiService
  ) {}

  ngOnInit() {
    this.uiService.isCollapsed$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.isCollapsed = state;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidebar() {
    this.uiService.toggleSidebar();
  }

  toggleMenu(): void {
    this.sidenav.toggle();
  }

  logout(): void {
    this.store.dispatch(logout());
  }
}
