import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddClinicComponent } from '../add-clinic/add-clinic.component';
import { ClinicService } from '../services/clinic.service';
import { IClinic } from 'src/app/entities/IClinic';
import { MatOptionSelectionChange } from '@angular/material/core';
import { SessionService } from 'src/app/utils/session/session.service';
import { props, Store } from '@ngrx/store';
import { AuthState } from 'src/app/store/reducers/auth.reducer';
import { Observable } from 'rxjs';
import { selectClinicId } from 'src/app/store/selectors/auth.selectors';
import { setClinic } from 'src/app/store/actions/auth.actions';

@Component({
    selector: 'app-clinic-list',
    templateUrl: './clinic-list.component.html',
    styleUrls: ['./clinic-list.component.css'],
    standalone: false
})
export class ClinicListComponent {
  displayedColumns: string[] = ['clinicName', 'location', 'contactInfo', 'actions'];
  clinics: IClinic[] = [];
  isEdit: boolean = false;
  clinicId: string | null | undefined;
  selectClinic$: Observable<string | null>;

  constructor(private dialog: MatDialog, private clinicService: ClinicService, private store: Store<{ auth: AuthState }>, private session: SessionService) {
    this.selectClinic$ = this.store.select(selectClinicId);
  }

  ngOnInit() {
    this.getClinics();
  }

  getClinicId(): void {
    this.session.getClinicId().subscribe({
      next: clinicId => {
        console.log('Clinic ID:', clinicId);
        this.clinicId = clinicId;
      },
      error: err => {
        console.error('Error fetching clinic ID:', err);
      }});
  }

  selectClinic($event: MatOptionSelectionChange): void {
    const selectedClinidId = this.clinics.find(clinic => clinic.name === $event.source.value)?.id?.toString() ?? null;
    this.store.dispatch(setClinic({ clinicId: selectedClinidId }));
      console.log('Selected Clinic ID:', selectedClinidId);
    console.log($event);
  }

  addClinicToggle(): void {
    this.dialog.open(AddClinicComponent, {width: '400px'});
    this.dialog.afterAllClosed.subscribe(res => {
      console.log(res);
      this.getClinics();
    });
  }

  async getClinics(): Promise<void> {
    try {
      await this.clinicService.getClinics().subscribe(clinics => {
        console.log('Clinics', clinics);
        this.clinics = clinics;
      });
    } catch(error) {
      console.error(error);
    }
  }

  editClinic(clinic: IClinic): void {
    this.isEdit = true;
    this.dialog.open(AddClinicComponent, {width: '400px', data: [clinic, this.isEdit]})
  }

  deleteClinic(id: number):void {

  }

}
