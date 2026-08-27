import {
  Component,
  Input,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import {
  AuditReport,
  AccessByUserReport,
  AccessByClinicReport,
} from '../../../entities';

@Component({
  selector: 'app-audit-report-dashboard',
  templateUrl: './audit-report-dashboard.component.html',
  styleUrls: ['./audit-report-dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class AuditReportDashboardComponent implements OnChanges {
  @Input() report!: AuditReport;

  userDisplayedColumns: string[] = [
    'userName',
    'accessCount',
    'lastAccessTime',
  ];
  clinicDisplayedColumns: string[] = [
    'clinicName',
    'accessCount',
    'consentViolationCount',
  ];

  barChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 },
      },
    },
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['report'] && this.report) {
      this.buildChartData();
    }
  }

  private buildChartData(): void {
    const dates = this.report.accessesByDate.map((entry) => {
      const d = new Date(entry.date);
      return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
    });

    this.barChartData = {
      labels: dates,
      datasets: [
        {
          data: this.report.accessesByDate.map((e) => e.accessCount),
          label: 'Accesos',
          backgroundColor: 'rgba(91, 108, 255, 0.7)',
          borderColor: 'rgba(91, 108, 255, 1)',
          borderWidth: 1,
          borderRadius: 4,
        },
        {
          data: this.report.accessesByDate.map(
            (e) => e.consentViolationCount
          ),
          label: 'Violaciones',
          backgroundColor: 'rgba(248, 113, 113, 0.7)',
          borderColor: 'rgba(248, 113, 113, 1)',
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    };
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
