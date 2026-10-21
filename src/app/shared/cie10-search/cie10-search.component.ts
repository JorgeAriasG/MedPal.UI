import { Component, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';

export interface Cie10Code {
  id: number;
  code: string;
  description: string;
  category?: string;
}

@Component({
  selector: 'app-cie10-search',
  templateUrl: './cie10-search.component.html',
  styleUrls: ['./cie10-search.component.css'],
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: Cie10SearchComponent,
      multi: true,
    },
  ],
})
export class Cie10SearchComponent implements ControlValueAccessor, OnInit {
  @Input() label = 'Diagnóstico CIE-10';
  @Input() placeholder = 'Buscar código o descripción...';

  selectedCodes: Cie10Code[] = [];
  searchTerm = '';
  searchResults: Cie10Code[] = [];
  showDropdown = false;
  disabled = false;

  private searchTerms = new Subject<string>();
  private destroy$ = new Subject<void>();
  private onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.searchTerms
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => this.searchCodes(term)),
        takeUntil(this.destroy$)
      )
      .subscribe((results) => {
        this.searchResults = results;
        this.showDropdown = true;
      });
  }

  private searchCodes(term: string): Observable<Cie10Code[]> {
    if (!term || term.length < 2) {
      this.searchResults = [];
      return new Observable((observer) => {
        observer.next([]);
        observer.complete();
      });
    }
    return this.apiService.get<Cie10Code[]>(`cie10?search=${encodeURIComponent(term)}&limit=20`);
  }

  onSearchInput(term: string): void {
    this.searchTerms.next(term);
  }

  selectCode(code: Cie10Code): void {
    if (!this.selectedCodes.find((c) => c.code === code.code)) {
      this.selectedCodes.push(code);
      this.emitChange();
    }
    this.searchTerm = '';
    this.searchResults = [];
    this.showDropdown = false;
  }

  removeCode(code: Cie10Code): void {
    this.selectedCodes = this.selectedCodes.filter((c) => c.code !== code.code);
    this.emitChange();
  }

  private emitChange(): void {
    const codes = this.selectedCodes.map((c) => c.code);
    this.onChange(JSON.stringify(codes));
    this.onTouched();
  }

  writeValue(value: string): void {
    if (!value) {
      this.selectedCodes = [];
      return;
    }
    try {
      const codes = JSON.parse(value) as string[];
      if (Array.isArray(codes)) {
        codes.forEach((code) => {
          if (!this.selectedCodes.find((c) => c.code === code)) {
            this.selectedCodes.push({ id: 0, code, description: '' });
          }
        });
      }
    } catch {
      this.selectedCodes = [];
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
