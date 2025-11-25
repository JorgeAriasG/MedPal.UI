import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthState } from 'src/app/store/reducers/auth.reducer';
import { logout } from 'src/app/store/actions/auth.actions';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css'],
    standalone: false
})
export class MenuComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor( private router: Router, private store: Store<{ auth: AuthState }>) {}

  toggleMenu(): void {
    this.sidenav.toggle();
  }

  logout(): void {
    this.store.dispatch(logout());
    // this.router.navigate(['/login']);
  }
}
