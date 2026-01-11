import { Component, OnDestroy, OnInit } from '@angular/core';
import { RolesService } from '../services/roles.service';
import { IRole } from 'src/app/entities/IRole';
import { EditModalComponent } from '../../../../shared/edit-modal/edit-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { selectClinicId } from 'src/app/store/selectors/auth.selectors';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-roles-list',
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.css'],
  standalone: false,
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-12px)' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class RolesListComponent implements OnInit, OnDestroy {
  roles: IRole[] = [];
  addRole: boolean = false;
  displayedColumns: string[] = ['name', 'description', 'actions'];
  editRoleId: any = null;
  editRoleData: Partial<IRole> = {};
  clinicId: number | null | undefined;

  private destroy$ = new Subject<void>();

  constructor(
    private rolesService: RolesService,
    private dialog: MatDialog,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.store
      .select(selectClinicId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (clinicId) => {
          this.clinicId = clinicId;
          console.log('Clinic ID in RolesListComponent from store:', clinicId);
          this.getRoles();
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addRoleToggle(): void {
    this.addRole = !this.addRole;
  }

  onRoleAdded(): void {
    console.log('Role added event received');
    this.addRoleToggle();
    this.getRoles();
  }

  getRoles(): void {
    this.rolesService
      .getRoles(this.clinicId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((roles: IRole[]) => {
        this.roles = roles;
        console.log('Roles loaded:', this.roles);
      });
  }

  deleteRole(id: number): void {
    this.rolesService
      .deleteRole(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.getRoles();
        console.log(res);
      });
  }

  editRole(role: IRole): void {
    this.dialog
      .open(EditModalComponent, {
        data: {
          entityType: 'role',
          data: role,
          title: 'Edit Role',
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.saveEdit(result);
        }
      });
  }

  saveEdit(role: Partial<IRole>): void {
    this.rolesService
      .editRole(role)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.cancelEdit();
        this.getRoles();
        console.log(res);
      });
  }

  cancelEdit(): void {
    this.editRoleId = null;
    this.editRoleData = {};
  }

  trackByRole(index: number, role: IRole): string | undefined {
    return role.name;
  }
}
