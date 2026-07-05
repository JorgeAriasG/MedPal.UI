import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IAppointment } from '../entities/IAppointment';
import { IPatient } from '../entities/IPatient';

import { AppointmensService } from '../components/appointments/services/appointmens.service';
import { PatientsService } from '../components/patients/services/patients.service';
import { UserService } from '../components/user/services/user.service';
import { ReportData, AppointmentSummary, DoctorPerformance } from '../models/report.models';

@Injectable({ providedIn: 'root' })
export class ReportService {
  constructor(
    private appointmensService: AppointmensService,
    private patientsService: PatientsService,
    private userService: UserService,
  ) {}

  getReportData(clinicId: number, from: Date, to: Date, doctorId?: number | null, isAdmin?: boolean): Observable<ReportData> {
    const toEnd = new Date(to);
    toEnd.setHours(23, 59, 59, 999);

    const appointments$ = this.appointmensService.getAppointments(clinicId).pipe(
      catchError(() => of([])),
    );
    const patients$ = this.patientsService.getPatients(clinicId).pipe(
      catchError(() => of([])),
    );
    const users$ = isAdmin
      ? this.userService.getUsers().pipe(catchError(() => of([])))
      : this.getCurrentUserList();

    return forkJoin({ appointments: appointments$, patients: patients$, users: users$ }).pipe(
      map(({ appointments, patients, users }) => {
        const appts: IAppointment[] = Array.isArray(appointments) ? appointments : [];
        const pats: IPatient[] = Array.isArray(patients) ? patients : [];
        const usrs: any[] = Array.isArray(users) ? users : [];

        const parseDate = (a: any): Date | null => {
          if (!a.date) return null;
          if (typeof a.date === 'string') {
            const d = new Date(a.date + 'T00:00:00');
            return isNaN(d.getTime()) ? null : d;
          }
          const d = new Date(a.date.year, a.date.month - 1, a.date.day);
          return isNaN(d.getTime()) ? null : d;
        };

        const inRange = appts.filter(a => {
          const d = parseDate(a);
          return d && d >= from && d <= toEnd;
        });

        const filtered = doctorId ? inRange.filter(a => a.userId === doctorId) : inRange;

        const patientMap = new Map<number, string>();
        pats.forEach(p => {
          if (p.id == null) return;
          const fullName = [p.name, p.middlename, p.lastname].filter(Boolean).join(' ');
          patientMap.set(Number(p.id), fullName);
        });

        const doctorMap = new Map<number, string>();
        usrs.forEach((u: any) => {
          if (u.id != null) doctorMap.set(Number(u.id), u.name);
        });

        const summary = this.computeSummary(filtered);

        const doctorPerformance = this.computeDoctorPerformance(filtered, usrs);

        const appointmentDetails = filtered.map(a => {
          const aAny = a as any;
          const patientId = aAny.patientId ?? aAny.patient?.id;
          const patientName = (patientId != null ? patientMap.get(Number(patientId)) : null)
            || aAny.patient?.name
            || '—';
          const dateStr = typeof aAny.date === 'string'
            ? aAny.date
            : `${aAny.date.year}-${String(aAny.date.month).padStart(2, '0')}-${String(aAny.date.day).padStart(2, '0')}`;
          const timeStr = typeof aAny.time === 'string'
            ? aAny.time
            : `${String(aAny.time?.hour ?? 0).padStart(2, '0')}:${String(aAny.time?.minute ?? 0).padStart(2, '0')}`;
          return {
            id: a.id ?? 0,
            date: dateStr,
            time: timeStr,
            patientName,
            doctorName: (a.userId != null ? doctorMap.get(Number(a.userId)) : null) || '—',
            doctorId: a.userId ?? 0,
            status: a.status,
            durationMinutes: a.durationMinutes ?? 0,
          };
        });

        appointmentDetails.sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

        return { summary, doctorPerformance, appointmentDetails, totalItems: appointmentDetails.length };
      }),
    );
  }

  private getCurrentUserList(): Observable<any[]> {
    try {
      const raw = localStorage.getItem('user_data');
      if (!raw) return of([]);
      const user = JSON.parse(raw);
      if (user && user.id) {
        return of([{ id: user.id, name: user.name || 'Dr.', specialty: '' }]);
      }
    } catch { /* ignore */ }
    return of([]);
  }

  exportToCsv(data: ReportData): void {
    const headers = ['Fecha', 'Hora', 'Paciente', 'Médico', 'Estado', 'Duración (min)'];
    const rows = data.appointmentDetails.map(r => [
      r.date, r.time, r.patientName, r.doctorName, r.status, r.durationMinutes,
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  private computeSummary(appointments: IAppointment[]): AppointmentSummary {
    const total = appointments.length;
    const completed = appointments.filter(a => a.status === 'Completed').length;
    const cancelled = appointments.filter(a => a.status === 'Cancelled').length;
    const noShow = appointments.filter(a => a.status === 'NoShow').length;
    const scheduled = appointments.filter(a => a.status === 'Scheduled').length;
    const inProgress = appointments.filter(a => a.status === 'InProgress').length;
    const rescheduled = appointments.filter(a => a.status === 'Rescheduled').length;

    const withDuration = appointments.filter(a => a.status === 'Completed' && a.durationMinutes);
    const avgDur = withDuration.length
      ? Math.round(withDuration.reduce((s, a) => s + (a.durationMinutes ?? 0), 0) / withDuration.length)
      : 0;

    return {
      totalAppointments: total,
      completed,
      cancelled,
      noShow,
      scheduled,
      inProgress,
      rescheduled,
      completionRate: total ? Math.round((completed / total) * 100) : 0,
      noShowRate: total ? Math.round((noShow / total) * 100) : 0,
      cancellationRate: total ? Math.round((cancelled / total) * 100) : 0,
      averageDuration: avgDur,
    };
  }

  private computeDoctorPerformance(appointments: IAppointment[], users: any[]): DoctorPerformance[] {
    const doctorIds = [...new Set(appointments.map(a => a.userId).filter((id): id is number => id != null))];
    const userMap = new Map(users.filter((u: any) => u.id != null).map((u: any) => [u.id, u]));

    return doctorIds.map(id => {
      const doctorAppts = appointments.filter(a => a.userId === id);
      const total = doctorAppts.length;
      const completed = doctorAppts.filter(a => a.status === 'Completed').length;
      const cancelled = doctorAppts.filter(a => a.status === 'Cancelled').length;
      const noShow = doctorAppts.filter(a => a.status === 'NoShow').length;
      const withDuration = doctorAppts.filter(a => a.status === 'Completed' && a.durationMinutes);
      const avgDur = withDuration.length
        ? Math.round(withDuration.reduce((s, a) => s + (a.durationMinutes ?? 0), 0) / withDuration.length)
        : 0;
      const user: any = userMap.get(id);

      return {
        doctorId: id,
        doctorName: user?.name ?? `Dr. #${id}`,
        specialty: user?.specialty ?? '—',
        totalAppointments: total,
        completed,
        cancelled,
        noShow,
        completionRate: total ? Math.round((completed / total) * 100) : 0,
        noShowRate: total ? Math.round((noShow / total) * 100) : 0,
        averageDuration: avgDur,
      };
    });
  }
}
