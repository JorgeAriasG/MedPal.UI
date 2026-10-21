import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-timeout-warning',
  templateUrl: './timeout-warning.component.html',
  styleUrls: ['./timeout-warning.component.css'],
  standalone: false,
})
export class TimeoutWarningComponent {
  @Input() remainingSeconds = 60;
  @Output() continue = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  get displayMinutes(): number {
    return Math.floor(this.remainingSeconds / 60);
  }

  get displaySeconds(): number {
    return this.remainingSeconds % 60;
  }

  onContinue(): void {
    this.continue.emit();
  }

  onLogout(): void {
    this.logout.emit();
  }
}
