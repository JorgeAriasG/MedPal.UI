import {
  Component,
  Input,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

/**
 * Statistics Card Component
 *
 * Dumb (presentational) component for displaying a single statistic/KPI
 * Displays a metric with icon, value, and optional subtitle/action
 *
 * Usage:
 * ```html
 * <app-statistics-card
 *   [label]="'Appointments Today'"
 *   [value]="5"
 *   [icon]="'event'"
 *   [subtitle]="'+2 this week'"
 *   [color]="'primary'"
 *   [onClick]="navigateToAppointments"
 * ></app-statistics-card>
 * ```
 */
@Component({
  selector: 'app-statistics-card',
  template: `
    <mat-card
      class="statistics-card"
      [ngClass]="'color-' + color"
      [matTooltip]="tooltip"
      (click)="onCardClick()"
      [style.cursor]="clickable ? 'pointer' : 'default'"
    >
      <mat-card-content>
        <div class="card-layout">
          <!-- Icon Section -->
          <div class="icon-section">
            <mat-icon class="stat-icon" [color]="color">{{ icon }}</mat-icon>
          </div>

          <!-- Content Section -->
          <div class="content-section">
            <h3 class="stat-label">{{ label }}</h3>
            <p class="stat-value">{{ value }}</p>
            <p *ngIf="subtitle" class="stat-subtitle">{{ subtitle }}</p>
          </div>

          <!-- Action Section (optional) -->
          <div *ngIf="clickable" class="action-icon">
            <mat-icon class="action-icon-symbol">arrow_forward</mat-icon>
          </div>
        </div>

        <!-- Optional Progress Indicator -->
        <div *ngIf="percentage !== undefined" class="progress-bar">
          <div
            class="progress-fill"
            [ngClass]="'progress-' + color"
            [style.width.%]="percentage"
          ></div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .statistics-card {
      transition: all var(--transition-normal);
      background: var(--color-bg-surface);
      border-left: 4px solid var(--color-primary);
      cursor: pointer;
      position: relative;
      overflow: hidden;

      &:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-lg);
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

    mat-card-content {
      padding: var(--spacing-md);
    }

    .card-layout {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-md);
      justify-content: space-between;
    }

    .icon-section {
      flex-shrink: 0;
    }

    .stat-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
    }

    .content-section {
      flex: 1;
    }

    .stat-label {
      font-size: var(--font-size-small);
      font-weight: var(--font-weight-medium);
      color: var(--color-text-secondary);
      margin: 0 0 var(--spacing-xs) 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: bold;
      color: var(--color-text-primary);
      margin: 0;
      line-height: 1;
    }

    .stat-subtitle {
      font-size: var(--font-size-small);
      color: var(--color-text-secondary);
      margin: var(--spacing-xs) 0 0 0;
    }

    .action-icon {
      display: flex;
      align-items: center;
      opacity: 0;
      transition: opacity var(--transition-normal);

      .statistics-card:hover & {
        opacity: 1;
      }
    }

    .action-icon-symbol {
      color: var(--color-primary);
    }

    .progress-bar {
      height: 3px;
      background: var(--color-bg-page);
      margin-top: var(--spacing-sm);
      border-radius: 2px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      transition: width var(--transition-normal);
      border-radius: 2px;

      &.progress-primary {
        background: var(--color-primary);
      }

      &.progress-success {
        background: var(--color-success);
      }

      &.progress-warning {
        background: var(--color-warning);
      }

      &.progress-danger {
        background: var(--color-danger);
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatTooltipModule],
})
export class StatisticsCardComponent implements OnInit {
  /**
   * Label/title for the statistic
   */
  @Input() label: string = '';

  /**
   * Main value to display
   */
  @Input() value: string | number = 0;

  /**
   * Material icon name
   */
  @Input() icon: string = 'info';

  /**
   * Optional subtitle/description
   */
  @Input() subtitle?: string;

  /**
   * Color variant: 'primary' | 'success' | 'warning' | 'danger'
   */
  @Input() color: 'primary' | 'success' | 'warning' | 'danger' = 'primary';

  /**
   * Optional tooltip text
   */
  @Input() tooltip?: string;

  /**
   * Optional progress percentage (0-100)
   */
  @Input() percentage?: number;

  /**
   * Whether the card is clickable
   */
  @Input() clickable: boolean = false;

  /**
   * Callback function when card is clicked
   */
  @Input() onClick?: () => void;

  ngOnInit(): void {
    if (!this.tooltip) {
      this.tooltip = `${this.label}: ${this.value}`;
    }
  }

  /**
   * Handle card click
   */
  onCardClick(): void {
    if (this.clickable && this.onClick) {
      this.onClick();
    }
  }
}
