import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MedicalHistoryReadDTO } from 'src/app/entities/medical-history.model';
import { MedicalHistoryService } from 'src/app/services/medical-history.service';
import {
  DentalData,
  NutritionData,
  GenericData,
} from 'src/app/entities/specialty-templates.model';

@Component({
  selector: 'app-history-timeline',
  templateUrl: './history-timeline.component.html',
  styleUrls: ['./history-timeline.component.css'],
  standalone: false,
})
export class HistoryTimelineComponent implements OnChanges {
  @Input() patientId!: number;
  @Input() historyEntries: MedicalHistoryReadDTO[] = [];

  loading = false;
  error = '';
 
  // Filtering properties
  selectedSpecialty: string = 'Todas';
  startDate: Date | null = null;
  endDate: Date | null = null;
  searchTerm: string = '';
  filteredEntries: MedicalHistoryReadDTO[] = [];
 
  specialties: string[] = ['Todas', 'Dental', 'Nutrición', 'General'];

  constructor(private medicalHistoryService: MedicalHistoryService) {}

  ngOnInit(): void {
    if (this.historyEntries) {
      this.sortEntries();
      this.applyFilters();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['historyEntries'] && this.historyEntries) {
      this.sortEntries();
      this.applyFilters();
    }
  }
 
  sortEntries(): void {
    this.historyEntries.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });
  }
 
  applyFilters(): void {
    this.filteredEntries = this.historyEntries.filter((entry) => {
      // 1. Specialty Filter
      const matchesSpecialty =
        this.selectedSpecialty === 'Todas' ||
        entry.specialtyType === this.selectedSpecialty;
 
      // 2. Date Filter
      const entryDate = new Date(entry.createdAt);
      // Set hours to 0 to compare full days
      entryDate.setHours(0, 0, 0, 0);
 
      const start = this.startDate ? new Date(this.startDate) : null;
      if (start) start.setHours(0, 0, 0, 0);
 
      const end = this.endDate ? new Date(this.endDate) : null;
      if (end) end.setHours(0, 0, 0, 0);
 
      const matchesDate =
        (!start || entryDate >= start) && (!end || entryDate <= end);
 
      // 3. Search Filter
      const search = this.searchTerm.toLowerCase();
      const matchesSearch =
        !search ||
        (entry.diagnosis?.toLowerCase().includes(search) ?? false) ||
        (entry.doctorName?.toLowerCase().includes(search) ?? false) ||
        (entry.clinicalNotes?.toLowerCase().includes(search) ?? false);
 
      return matchesSpecialty && matchesDate && matchesSearch;
    });
  }
 
  resetFilters(): void {
    this.selectedSpecialty = 'Todas';
    this.startDate = null;
    this.endDate = null;
    this.searchTerm = '';
    this.applyFilters();
  }

  parseSpecialtyData(entry: MedicalHistoryReadDTO): any {
    return this.medicalHistoryService.parseSpecialtyData(entry.specialtyData);
  }

  getDentalData(entry: MedicalHistoryReadDTO): DentalData | null {
    return this.medicalHistoryService.parseSpecialtyData<DentalData>(
      entry.specialtyData
    );
  }

  getNutritionData(entry: MedicalHistoryReadDTO): NutritionData | null {
    return this.medicalHistoryService.parseSpecialtyData<NutritionData>(
      entry.specialtyData
    );
  }

  getGenericData(entry: MedicalHistoryReadDTO): GenericData | null {
    return this.medicalHistoryService.parseSpecialtyData<GenericData>(
      entry.specialtyData
    );
  }

  getToothStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      sano: '#4caf50',
      caries: '#f44336',
      resina: '#2196f3',
      corona: '#ffc107',
      ausente: '#9e9e9e',
      endodoncia: '#9c27b0',
    };
    return colors[status] || '#4caf50';
  }

  getIMCColor(imc: number): string {
    if (imc === 0) return '#9e9e9e';
    if (imc < 18.5) return '#ff9800';
    if (imc < 25) return '#4caf50';
    if (imc < 30) return '#ff9800';
    return '#f44336';
  }
}
