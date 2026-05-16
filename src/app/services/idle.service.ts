import { Injectable, OnDestroy } from '@angular/core';
import { Subject, fromEvent, merge, interval, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class IdleService implements OnDestroy {
  readonly warning$ = new Subject<void>();
  readonly timeout$ = new Subject<void>();
  readonly tick$ = new BehaviorSubject<number>(0);

  private activity$ = new Subject<void>();
  private destroy$ = new Subject<void>();
  private lastActivity = Date.now();
  private warningActive = false;
  private isRunning = false;

  readonly TIMEOUT_MS = 15 * 60 * 1000;
  readonly WARNING_MS = 60 * 1000;

  get remainingSeconds(): number {
    const elapsed = Date.now() - this.lastActivity;
    const remaining = this.TIMEOUT_MS - elapsed;
    return Math.max(0, Math.floor(remaining / 1000));
  }

  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastActivity = Date.now();
    this.warningActive = false;

    merge(
      fromEvent(document, 'mousedown'),
      fromEvent(document, 'keydown'),
      fromEvent(document, 'touchstart'),
      fromEvent(document, 'scroll'),
      fromEvent(document, 'click'),
      fromEvent(document, 'wheel'),
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.lastActivity = Date.now();
        this.warningActive = false;
      });

    interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.tick$.next(this.remainingSeconds);
        const elapsed = Date.now() - this.lastActivity;
        if (elapsed >= this.TIMEOUT_MS) {
          this.timeout$.next();
          this.stop();
        } else if (elapsed >= this.TIMEOUT_MS - this.WARNING_MS && !this.warningActive) {
          this.warningActive = true;
          this.warning$.next();
        }
      });
  }

  reset(): void {
    this.lastActivity = Date.now();
    this.warningActive = false;
  }

  stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;
    this.destroy$.next();
    this.tick$.next(0);
  }

  ngOnDestroy(): void {
    this.stop();
    this.warning$.complete();
    this.timeout$.complete();
    this.tick$.complete();
  }
}
