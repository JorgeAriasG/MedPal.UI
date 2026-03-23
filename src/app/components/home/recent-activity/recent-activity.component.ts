import {
  Component,
  Input,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';

/**
 * Activity Item
 */
export interface ActivityItem {
  id: number;
  type: 'appointment' | 'patient' | 'prescription' | 'system';
  title: string;
  description: string;
  timestamp: Date;
  icon: string;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  user?: string;
  actionLabel?: string;
  actionCallback?: () => void;
}

/**
 * Recent Activity Component
 *
 * Dumb (presentational) component displaying recent activities
 * Shows timeline of recent patient/appointment/system activities
 *
 * Usage:
 * ```html
 * <app-recent-activity
 *   [activities]="recentActivities"
 *   [maxItems]="5"
 *   title="Recent Activity"
 *   (onActivityClick)="handleActivityClick($event)"
 * ></app-recent-activity>
 * ```
 */
@Component({
  selector: 'app-recent-activity',
  template: `
    <mat-card class="activity-card">
      <!-- Header -->
      <mat-card-header class="activity-header">
        <div class="header-content">
          <mat-card-title>{{ title }}</mat-card-title>
          <p class="header-subtitle">{{ activities.length }} recent activities</p>
        </div>
        <button
          *ngIf="showViewAll"
          mat-button
          color="primary"
          (click)="onViewAll()"
          class="view-all-btn"
        >
          View All
          <mat-icon>arrow_forward</mat-icon>
        </button>
      </mat-card-header>

      <!-- Activity List -->
      <mat-card-content>
        <mat-list *ngIf="displayedActivities.length > 0" class="activity-list">
          <mat-list-item
            *ngFor="let activity of displayedActivities; let last = last"
            [ngClass]="'activity-item activity-' + activity.type"
            (click)="selectActivity(activity)"
            [class.selected]="selectedActivity?.id === activity.id"
          >
            <!-- Timeline Dot -->
            <div matListItemAvatar class="activity-avatar">
              <div
                class="timeline-dot"
                [ngClass]="'color-' + (activity.color || 'primary')"
              >
                <mat-icon class="activity-icon">{{ activity.icon }}</mat-icon>
              </div>
              <div *ngIf="!last" class="timeline-line"></div>
            </div>

            <!-- Activity Content -->
            <div matListItemTitle class="activity-content">
              <div class="activity-main">
                <h4 class="activity-title">{{ activity.title }}</h4>
                <p class="activity-description">{{ activity.description }}</p>
                <div class="activity-meta">
                  <span class="activity-time">{{ formatTime(activity.timestamp) }}</span>
                  <span *ngIf="activity.user" class="activity-user">
                    by {{ activity.user }}
                  </span>
                </div>
              </div>

              <!-- Action Button -->
              <div
                *ngIf="activity.actionLabel && activity.actionCallback"
                class="activity-action"
              >
                <button
                  mat-stroked-button
                  size="small"
                  (click)="activity.actionCallback!()"
                  (click)="$event.stopPropagation()"
                  class="action-btn"
                >
                  {{ activity.actionLabel }}
                </button>
              </div>
            </div>
          </mat-list-item>
        </mat-list>

        <!-- Empty State -->
        <div *ngIf="displayedActivities.length === 0" class="empty-state">
          <mat-icon class="empty-icon">history</mat-icon>
          <p class="empty-text">No recent activities</p>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .activity-card {
      background: var(--color-bg-surface);
      overflow: hidden;
    }

    .activity-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: var(--spacing-md);
      border-bottom: 1px solid var(--color-border);

      .header-content {
        flex: 1;

        mat-card-title {
          margin: 0 0 var(--spacing-xs) 0;
        }

        .header-subtitle {
          margin: 0;
          font-size: var(--font-size-small);
          color: var(--color-text-secondary);
        }
      }

      .view-all-btn {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);

        mat-icon {
          font-size: 1rem;
          height: 1rem;
          width: 1rem;
        }
      }
    }

    mat-card-content {
      padding: 0;
    }

    .activity-list {
      padding: 0;
    }

    .activity-item {
      padding: var(--spacing-md) !important;
      border-bottom: 1px solid var(--color-bg-page);
      transition: background-color var(--transition-normal);
      cursor: pointer;

      &:hover {
        background-color: var(--color-bg-page);
      }

      &.selected {
        background-color: var(--color-bg-page);
      }

      &:last-child {
        border-bottom: none;
      }
    }

    .activity-avatar {
      position: relative;
      width: 50px;
      min-width: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .timeline-dot {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1rem;

      &.color-primary {
        background: var(--color-primary);
      }

      &.color-success {
        background: var(--color-success);
      }

      &.color-warning {
        background: var(--color-warning);
      }

      &.color-danger {
        background: var(--color-danger);
      }
    }

    .activity-icon {
      font-size: 1.25rem;
    }

    .timeline-line {
      position: absolute;
      width: 2px;
      height: 40px;
      background: var(--color-primary);
      top: 50%;
      left: 19px;
    }

    .activity-content {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--spacing-md);
    }

    .activity-main {
      flex: 1;

      .activity-title {
        margin: 0 0 var(--spacing-xs) 0;
        font-weight: var(--font-weight-medium);
        color: var(--color-text-primary);
      }

      .activity-description {
        margin: 0 0 var(--spacing-xs) 0;
        color: var(--color-text-secondary);
        font-size: var(--font-size-small);
      }

      .activity-meta {
        display: flex;
        gap: var(--spacing-sm);
        font-size: var(--font-size-small);
        color: var(--color-text-secondary);

        .activity-time {
          font-weight: 500;
        }

        .activity-user {
          &::before {
            content: '•';
            margin-right: var(--spacing-xs);
          }
        }
      }
    }

    .activity-action {
      flex-shrink: 0;

      .action-btn {
        white-space: nowrap;
      }
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-2xl);
      text-align: center;
      min-height: 200px;

      .empty-icon {
        font-size: 3rem;
        width: 3rem;
        height: 3rem;
        color: var(--color-text-secondary);
        margin-bottom: var(--spacing-md);
        opacity: 0.5;
      }

      .empty-text {
        margin: 0;
        color: var(--color-text-secondary);
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatTooltipModule,
    MatChipsModule,
  ],
})
export class RecentActivityComponent implements OnInit {
  /**
   * List of activities to display
   */
  @Input() activities: ActivityItem[] = [];

  /**
   * Maximum items to display before "View All" button
   */
  @Input() maxItems: number = 5;

  /**
   * Component title
   */
  @Input() title: string = 'Recent Activity';

  /**
   * Show "View All" button
   */
  @Input() showViewAll: boolean = true;

  /**
   * Callback for "View All" click
   */
  @Input() onViewAllClick?: () => void;

  /**
   * Callback for activity selection
   */
  @Input() onActivityClick?: (activity: ActivityItem) => void;

  /**
   * Selected activity
   */
  selectedActivity: ActivityItem | null = null;

  /**
   * Activities to display (respecting maxItems)
   */
  displayedActivities: ActivityItem[] = [];

  ngOnInit(): void {
    this.updateDisplayedActivities();
  }

  /**
   * Update displayed activities based on maxItems
   */
  private updateDisplayedActivities(): void {
    this.displayedActivities = this.activities.slice(0, this.maxItems);
  }

  /**
   * Handle activity click
   */
  selectActivity(activity: ActivityItem): void {
    this.selectedActivity = activity;
    this.onActivityClick?.(activity);
  }

  /**
   * Format timestamp to relative time
   */
  formatTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return new Date(date).toLocaleDateString();
  }

  /**
   * Handle "View All" click
   */
  onViewAll(): void {
    this.onViewAllClick?.();
  }
}
