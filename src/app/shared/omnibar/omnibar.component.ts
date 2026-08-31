import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { KeyboardShortcutService } from '../../services/keyboard-shortcut.service';
import { Subscription, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { PatientsService } from '../../components/patients/services/patients.service';
import { AppointmentsService } from '../../components/appointments/services/appointments.service';
import { Router } from '@angular/router';
import { IAppointment } from 'src/app/entities/IAppointment';
import { IPatient } from 'src/app/entities/IPatient';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-omnibar',
  templateUrl: './omnibar.component.html',
  styleUrls: ['./omnibar.component.css'],
  standalone: false,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ transform: 'scale(0.95)', opacity: 0 }),
        animate('200ms cubic-bezier(0.16, 1, 0.3, 1)', style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ])
  ]
})
export class OmnibarComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  
  isOpen = false;
  results: any[] = [];
  selectedIndex = 0;
  searchMode = false;
  searchTerm = '';
  loading = false;
  creating = false;
  
  private sub = new Subscription();

  constructor(
    private shortcutService: KeyboardShortcutService,
    private patientService: PatientsService,
    private appointmentService: AppointmentsService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    public router: Router,
    private translate: TranslateService,
  ) {}

  ngOnInit() {
    this.sub.add(
      this.shortcutService.toggleOmnibar$.subscribe(() => {
        this.toggle();
      })
    );
  }

  toggle() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      setTimeout(() => this.searchInput.nativeElement.focus(), 50);
      this.selectedIndex = 0;
      this.searchTerm = '';
      this.results = [];
    }
  }

  close() {
    this.isOpen = false;
  }

  onSearch(event: any) {
    this.searchTerm = event.target.value;
    const clinicId = this.authService.getClinicId();

    if (this.searchTerm.length > 2 && clinicId) {
      this.searchMode = true;
      this.loading = true;
      
      this.patientService.getPatients(clinicId).pipe(
        map((patients: any[]) => patients.filter(p =>
          `${p.name} ${p.lastname || ''}`.trim().toLowerCase().includes(this.searchTerm.toLowerCase())
        )),
        catchError(() => of([]))
      ).subscribe(filtered => {
        this.results = filtered.slice(0, 5);
        this.loading = false;
        this.selectedIndex = 0;
      });
    } else {
      this.results = [];
      this.searchMode = false;
    }
  }

  moveFocus(dir: number) {
    const totalItems = this.results.length + 1;
    this.selectedIndex = (this.selectedIndex + dir + totalItems) % totalItems;
  }

  executeAction() {
    if (this.selectedIndex === 0) {
      this.createQuickAppointment();
    } else {
      this.selectPatient(this.results[this.selectedIndex - 1]);
    }
  }

  parseSmartInput(input: string) {
    const now = new Date();
    let targetDate = new Date(now);
    let targetHour = now.getHours() + 1;
    let targetMinute = 0;
    let cleanName = input;

    const lowerInput = input.toLowerCase();

    // 1. Detectar Día
    if (lowerInput.includes('mañana')) {
      targetDate.setDate(now.getDate() + 1);
      cleanName = cleanName.replace(/mañana/i, '');
    } else if (lowerInput.includes('hoy')) {
      cleanName = cleanName.replace(/hoy/i, '');
    } else {
      // Detectar días de la semana (lunes, martes...)
      const days = ['domingo', 'lunes', 'martes', 'miercoles', 'miércoles', 'jueves', 'viernes', 'sabado', 'sábado'];
      for (let i = 0; i < days.length; i++) {
        if (lowerInput.includes(days[i])) {
          const targetDay = i;
          const currentDay = now.getDay();
          let daysToAdd = (targetDay - currentDay + 7) % 7;
          if (daysToAdd === 0) daysToAdd = 7; // Si es 'lunes' y hoy es lunes, agendar para el próximo lunes
          targetDate.setDate(now.getDate() + daysToAdd);
          cleanName = cleanName.replace(new RegExp(days[i], 'gi'), '');
          break;
        }
      }
    }

    // 2. Detectar Hora (ej: 3pm, 10am, 15:00)
    const timeMatch = lowerInput.match(/(\d{1,2})(:(\d{2}))?\s*(am|pm)?/i);
    if (timeMatch) {
      let hour = parseInt(timeMatch[1]);
      const minutes = timeMatch[3] ? parseInt(timeMatch[3]) : 0;
      const ampm = timeMatch[4] ? timeMatch[4].toLowerCase() : null;

      if (ampm === 'pm' && hour < 12) hour += 12;
      if (ampm === 'am' && hour === 12) hour = 0;
      
      if (hour >= 0 && hour <= 23) {
        targetHour = hour;
        targetMinute = minutes;
        cleanName = cleanName.replace(timeMatch[0], '');
      }
    }

    return {
      name: cleanName.trim().replace(/\s+/g, ' '),
      date: {
        year: targetDate.getFullYear(),
        month: targetDate.getMonth() + 1,
        day: targetDate.getDate()
      },
      time: {
        hour: targetHour,
        minute: targetMinute
      }
    };
  }

  createQuickAppointment() {
    if (this.creating) return;

    if (!this.searchTerm) {
      this.searchInput.nativeElement.focus();
      return;
    }

    const smartData = this.parseSmartInput(this.searchTerm);
    const clinicId = this.authService.getClinicId();
    const userId = this.authService.getAuthContext().user?.id;

    if (!clinicId || !userId) {
      console.error('[OMNIBAR DEBUG] DATOS INCOMPLETOS');
      return;
    }

    const name = smartData.name.trim();
    if (name.length < 2) {
      this.snackBar.open(this.translate.instant('OMNIBAR.NAME_MIN_CHARS'), 'OK', {
        duration: 4000,
        panelClass: 'cf-toast-warn',
      });
      return;
    }

    const createAppointment = (patientId: number) => {
      const appointment: any = {
        patientId,
        clinicId,
        userId,
        status: 'Scheduled',
        date: smartData.date,
        time: smartData.time,
        durationMinutes: 30,
        notes: this.translate.instant('OMNIBAR.FALLBACK_NOTES'),
      };

      this.appointmentService.saveAppointment(appointment).subscribe({
        next: () => {
          this.creating = false;
          this.snackBar.open(this.translate.instant('OMNIBAR.APPOINTMENT_SUCCESS', { name }), 'OK', {
            duration: 3000,
            panelClass: 'cf-toast-success',
          });
          this.close();
          this.router.navigate(['/appointments']);
        },
        error: (err) => {
          this.creating = false;
          console.error('[OMNIBAR DEBUG] Error en la petición:', err);
          this.snackBar.open(this.translate.instant('OMNIBAR.APPOINTMENT_ERROR'), 'OK', {
            duration: 5000,
            panelClass: 'cf-toast-error',
          });
        },
      });
    };

    const existing = this.results.find(
      (p) =>
        p.name &&
        `${p.name} ${p.lastname || ''}`.trim().toLowerCase() === name.toLowerCase()
    );

    if (existing?.id) {
      createAppointment(existing.id);
      return;
    }

    const nameParts = name.split(' ');
    const patientPayload: IPatient = {
      name: nameParts[0],
      middlename: '',
      lastname: nameParts.slice(1).join(' ') || this.translate.instant('OMNIBAR.FALLBACK_LASTNAME'),
      phone: '',
      email: `pendiente_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}@clinicflow.temp`,
      address: this.translate.instant('OMNIBAR.FALLBACK_ADDRESS'),
      dob: new Date(new Date().getFullYear() - 30, new Date().getMonth(), new Date().getDate()),
      gender: this.translate.instant('OMNIBAR.FALLBACK_GENDER'),
      emergencyContact: '',
      clinicIds: [clinicId],
    };

    this.creating = true;
    this.patientService.addPatient(patientPayload).subscribe({
      next: (created) => {
        if (created?.id) {
          createAppointment(created.id);
        } else {
          this.creating = false;
          this.snackBar.open(this.translate.instant('OMNIBAR.PATIENT_CREATE_ERROR'), 'OK', {
            duration: 5000,
            panelClass: 'cf-toast-error',
          });
        }
      },
      error: (err) => {
        this.creating = false;
        console.error('[OMNIBAR DEBUG] Error al crear el paciente:', err);
        this.snackBar.open(this.translate.instant('OMNIBAR.PATIENT_CREATE_RETRY_ERROR'), 'OK', {
          duration: 5000,
          panelClass: 'cf-toast-error',
        });
      },
    });
  }

  selectPatient(patient: any) {
    this.close();
    this.router.navigate(['/patients', patient.id]);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
