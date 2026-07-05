export interface IClinic {
  id: number | null,
  name: string,
  location: string,
  contactInfo: string,
  open?: string,
  close?: string
}
