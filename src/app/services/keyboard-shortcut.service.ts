import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KeyboardShortcutService implements OnDestroy {
  private toggleOmnibarSource = new Subject<void>();
  toggleOmnibar$ = this.toggleOmnibarSource.asObservable();

  private eventListener: (event: KeyboardEvent) => void;

  constructor() {
    this.eventListener = (event: KeyboardEvent) => {
      // Detect Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        this.triggerOmnibar();
      }
    };

    window.addEventListener('keydown', this.eventListener);
  }

  triggerOmnibar() {
    this.toggleOmnibarSource.next();
  }

  ngOnDestroy() {
    window.removeEventListener('keydown', this.eventListener);
  }
}
