import {
  Component,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

/**
 * Quick Stat Item
 */
export interface QuickStat {
  label: string;
  value: string | number;
  unit?: string;
  icon: string;
  percentage?: number;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  tooltip?: string;
}

/**
 * Quick Stats Component
 *
 * Dumb (presentational) component displaying quick statistics
 * Shows small metric cards with progress bars and color coding
 *
 * Usage:
 * ```html
 * <app-quick-stats
 *   [stats]="quickStats"
 *   title="Clinic Metrics"
 * ></app-quick-stats>
 * ```
 */
@Component({
  selector: 'app-quick-stats',
  template: `
    <div class="quick-stats-container">
      <!-- Title -->
      <h3 class="stats-title" *ngIf="title">{{ title }}</h3>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div
          *ngFor="let stat of stats"
          class="stat-item"
          [ngClass]="'color-' + (stat.color || 'primary')"
          [matTooltip]="stat.tooltip"
        >
          <!-- Icon -->
          <div class="stat-icon">
            <mat-icon [color]="stat.color || 'primary'">{{ stat.icon }}</mat-icon>
          </div>

          <!-- Content -->
          <div class="stat-info">
            <p class="stat-label">{{ stat.label }}</p>
            <div class="stat-value-section">
              <span class="stat-value">{{ stat.value }}</span>
              <span *ngIf="stat.unit" class="stat-unit">{{ stat.unit }}</span>
            </div>
          </div>

          <!-- Progress Bar (optional) -->
          <div *ngIf="stat.percentage !== undefined" class="stat-progress">
            <mat-progress-bar
              [value]="stat.percentage"
              [color]="stat.color || 'primary'"
              mode="determinate"
            ></mat-progress-bar>
            <span class="progress-label">{{ stat.percentage }}%</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .quick-stats-container {
      width: 100%;
    }

    .stats-title {
      margin: 0 0 var(--spacing-md) 0;
      font-size: 1rem;
      font-weight: var(--font-weight-medium);
      color: var(--color-text-primary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: var(--spacing-md);
    }

    .stat-item {
      background: var(--color-bg-surface);
      border-radius: var(--border-radius-md);
      padding: var(--spacing-md);
      border-left: 4px solid var(--color-primary);
      transition: all var(--transition-normal);
      position: relative;

      &:hover {
        box-shadow: var(--shadow-md);
        transform: translateY(-2px);
      }

      &.color-primary {
        border-left-color: var(--color-primary);
      }

      &.color-success {
        border-left-color: var(--color-success);
      }

      &.color-warning {
        border-left-color: var(--color-warning);
      }

      &.color-danger {
        border-left-color: var(--color-danger);
      }
    }

    .stat-icon {
      margin-bottom: var(--spacing-sm);

      mat-icon {
        font-size: 1.5rem;
        width: 1.5rem;
        height: 1.5rem;
      }
    }

    .stat-info {
      margin-bottom: var(--spacing-sm);
    }

    .stat-label {
      margin: 0 0 var(--spacing-xs) 0;
      font-size: var(--font-size-small);
      color: var(--color-text-secondary);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .stat-value-section {
      display: flex;
      align-items: baseline;
      gap: var(--spacing-xs);
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--color-text-primary);
      line-height: 1;
    }

    .stat-unit {
      font-size: var(--font-size-small);
      color: var(--color-text-secondary);
      font-weight: 500;
    }

    .stat-progress {
      margin-top: var(--spacing-md);
    }

    ::ng-deep .stat-progress mat-progress-bar {
      height: 4px;
      border-radius: 2px;
    }

    .progress-label {
      display: block;
      font-size: 0.75rem;
      color: var(--color-text-secondary);
      margin-top: var(--spacing-xs);
      text-align: right;
      font-weight: 500;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .stat-item {
        padding: var(--spacing-sm);
      }

      .stat-value {
        font-size: 1.25rem;
      }

      .stat-icon mat-icon {
        font-size: 1.25rem;
        width: 1.25rem;
        height: 1.25rem;
      }
    }

    @media (max-width: 576px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatTooltipModule,
  ],
})
export class QuickStatsComponent {
  /**
   * List of statistics to display
   */
  @Input() stats: QuickStat[] = [];

  /**
   * Component title
   */
  @Input() title?: string;
}
