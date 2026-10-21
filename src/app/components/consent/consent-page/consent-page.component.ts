import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { ConsentGrantDialogComponent } from '../consent-grant-dialog/consent-grant-dialog.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { PermissionService } from '../../../services/permission.service';
import {
  selectAllConsents,
  selectPendingConsents,
  selectApprovedConsents,
  selectRevokedConsents,
  selectConsentLoading,
  selectConsentSubmitting,
  selectPendingConsentsCount,
  selectApprovedConsentsCount,
  selectRevokedConsentsCount,
} from '../../../store/consent/consent.selectors';
import * as ConsentActions from '../../../store/consent/consent.actions';

@Component({
  selector: 'app-consent-page',
  standalone: false,
  templateUrl: './consent-page.component.html',
  styleUrls: ['./consent-page.component.css'],
})
export class ConsentPageComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private dialog = inject(MatDialog);
  private permissionService = inject(PermissionService);
  private destroy$ = new Subject<void>();

  allConsents$ = this.store.select(selectAllConsents);
  pendingConsents$ = this.store.select(selectPendingConsents);
  approvedConsents$ = this.store.select(selectApprovedConsents);
  revokedConsents$ = this.store.select(selectRevokedConsents);
  loading$ = this.store.select(selectConsentLoading);
  submitting$ = this.store.select(selectConsentSubmitting);
  pendingCount$ = this.store.select(selectPendingConsentsCount);
  approvedCount$ = this.store.select(selectApprovedConsentsCount);
  revokedCount$ = this.store.select(selectRevokedConsentsCount);

  selectedTab = 0;
  searchTerm = '';
  scopeFilter = '';

  displayedColumns: string[] = [
    'patientName',
    'requestingClinicName',
    'ownerClinicName',
    'consentScope',
    'consentDate',
    'expiryDate',
    'actions',
  ];

  canApprove = this.permissionService.canApproveConsent();
  canRevoke = this.permissionService.canRevokeConsent();

  ngOnInit(): void {
    this.store.dispatch(ConsentActions.loadAllConsents());
  }

  openGrantDialog(): void {
    this.dialog.open(ConsentGrantDialogComponent, {
      panelClass: 'custom-dialog',
      width: '560px',
    });
  }

  approveConsent(consentId: number): void {
    this.store.dispatch(ConsentActions.approveConsent({ consentId }));
  }

  rejectConsent(consentId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Rechazar Consentimiento',
        message: '¿Está seguro de rechazar este consentimiento? Esta acción no se puede deshacer.',
        confirmText: 'Rechazar',
        cancelText: 'Cancelar',
        confirmColor: 'warn',
      } as ConfirmDialogData,
      panelClass: 'custom-dialog',
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.store.dispatch(ConsentActions.rejectConsent({ consentId }));
      }
    });
  }

  revokeConsent(consentId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Revocar Consentimiento',
        message: '¿Está seguro de revocar este consentimiento? El acceso a registros médicos será revocado.',
        confirmText: 'Revocar',
        cancelText: 'Cancelar',
        confirmColor: 'warn',
      } as ConfirmDialogData,
      panelClass: 'custom-dialog',
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.store.dispatch(ConsentActions.revokeConsent({ consentId }));
      }
    });
  }

  getScopeLabel(scope: string): string {
    const labels: Record<string, string> = {
      AllRecords: 'Todos los Registros',
      LabsOnly: 'Solo Laboratorio',
      SpecificDateRange: 'Rango de Fechas',
    };
    return labels[scope] || scope;
  }

  isExpired(expiryDate?: Date): boolean {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
