import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from 'src/app/components/user/services/user.service';
import { IUser } from 'src/app/entities/IUser';
import { EditModalComponent } from '../../../../shared/edit-modal/edit-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { selectClinicId } from 'src/app/store/selectors/auth.selectors';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
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
export class ListComponent implements OnInit, OnDestroy {
  users: IUser[] = [];
  displayedColumns: string[] = [
    'name',
    'email',
    'defaultClinicId',
    'actions',
  ];
  editUserId: any = null;
  editUserData: Partial<IUser> = {};
  clinicId: number | null | undefined;

  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
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
          console.log('Clinic ID in ListComponent from store:', clinicId);
          this.getUsers();
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(EditModalComponent, {
      width: '500px',
      disableClose: false,
      panelClass: 'custom-dialog',
      data: {
        entityType: 'user',
        data: {},
        title: 'Create New User',
        isCreate: true
      }
    });

    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe((result) => {
      if (result) {
        this.saveEdit(result);
      }
    });
  }

  getUsers(): void {
    this.userService
      .getUsers(this.clinicId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((users) => {
        this.users = users;
        console.log('Users loaded:', this.users);
      });
  }

  deleteUser(id: number): void {
    this.userService
      .deleteUser(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.getUsers();
        console.log(res);
      });
  }

  editUser(user: IUser): void {
    this.dialog
      .open(EditModalComponent, {
        data: {
          entityType: 'user',
          data: user,
          title: 'Edit User',
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.saveEdit(result);
        }
      });
  }

  saveEdit(user: Partial<IUser>): void {
    this.userService
      .editUser(user)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.cancelEdit();
        this.getUsers();
        console.log(res);
      });
  }

  cancelEdit(): void {
    this.editUserId = null;
    this.editUserData = {};
  }

  trackByUser(index: number, user: IUser): string {
    return user.email;
  }
}
