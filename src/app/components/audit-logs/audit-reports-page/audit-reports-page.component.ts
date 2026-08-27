import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-audit-reports-page',
  templateUrl: './audit-reports-page.component.html',
  styleUrls: ['./audit-reports-page.component.css'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
})
export class AuditReportsPageComponent {}
