export interface IClinic {
  id: number | null,
  name: string,
  location: string,
  contactInfo: string,
  open?: { hour: number, minute: number },
  close?: { hour: number, minute: number }
}
