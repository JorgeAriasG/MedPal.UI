export class AppointmentModel {
  patientId: string;
  userId: string;
  appointmentDate: Date;
  status: string;

  constructor(patientId: string, userId: string, appointmentDate: Date, status: string) {
    this.patientId = patientId;
    this.userId = userId;
    this.appointmentDate = appointmentDate;
    this.status = status;
  }

  mockAppointment(): AppointmentModel {
    return new AppointmentModel('', '', new Date(), '');
  }
}