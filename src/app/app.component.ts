import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthState } from './store/reducers/auth.reducer';
import { selectIsLoggedIn } from './store/selectors/auth.selectors';
import { UiService } from './services/ui.service';
import { KeyboardShortcutService } from './services/keyboard-shortcut.service';
import { IdleService } from './services/idle.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false,
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'scheduling.ui';
  isLoggedIn$: Observable<boolean>;
  isCollapsed = false;
  showTimeoutWarning = false;
  timeoutRemainingSeconds = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<{ auth: AuthState }>,
    private router: Router,
    private uiService: UiService,
    private shortcutService: KeyboardShortcutService,
    private idleService: IdleService,
    private authService: AuthService,
    private translate: TranslateService,
  ) {
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
    translate.setDefaultLang('es');
    translate.use('es');
  }

  ngOnInit() {
    this.uiService.isCollapsed$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.isCollapsed = state;
      });

    this.isLoggedIn$
      .pipe(takeUntil(this.destroy$), distinctUntilChanged())
      .subscribe(loggedIn => {
        if (loggedIn) {
          this.idleService.start();
        } else {
          this.idleService.stop();
          this.showTimeoutWarning = false;
        }
      });

    this.idleService.warning$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.showTimeoutWarning = true;
      });

    this.idleService.tick$
      .pipe(takeUntil(this.destroy$))
      .subscribe(seconds => {
        this.timeoutRemainingSeconds = seconds;
      });

    this.idleService.timeout$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.showTimeoutWarning = false;
        this.authService.logout();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openOmnibar() {
    this.shortcutService.triggerOmnibar();
  }

  toggleSidebar() {
    this.uiService.toggleSidebar();
  }

  onContinueSession(): void {
    this.idleService.reset();
    this.showTimeoutWarning = false;
  }

  onLogoutNow(): void {
    this.showTimeoutWarning = false;
    this.idleService.stop();
    this.authService.logout();
  }
}
