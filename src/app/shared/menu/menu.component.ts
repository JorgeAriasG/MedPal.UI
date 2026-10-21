import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { UiService } from 'src/app/services/ui.service';
import { AuthService } from 'src/app/services/auth.service';
import { Store } from '@ngrx/store';
import { selectUserRoles } from '../../store/selectors/auth.selectors';

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
  userRoles: string[] = [];

  constructor(
    private router: Router,
    private uiService: UiService,
    private authService: AuthService,
    private store: Store,
  ) {}

  ngOnInit() {
    this.uiService.isCollapsed$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.isCollapsed = state;
      });

    // Subscribe to user roles from store for menu filtering
    this.store.select(selectUserRoles).pipe(takeUntil(this.destroy$)).subscribe(
      (roles) => {
        this.userRoles = roles || [];
      },
    );
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
    this.authService.logout();
  }

  /**
   * Check if menu item should be visible based on user roles
   * @param allowedRoles Roles that can see this item
   * @returns true if user has at least one of the allowed roles
   */
  hasRole(allowedRoles: string[]): boolean {
    if (!this.userRoles || this.userRoles.length === 0) return false;
    return this.userRoles.some((role) => allowedRoles.includes(role));
  }
}