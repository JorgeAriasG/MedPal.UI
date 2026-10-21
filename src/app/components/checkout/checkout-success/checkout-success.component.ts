import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout-success',
  templateUrl: './checkout-success.component.html',
  styleUrls: ['./checkout-success.component.css'],
  standalone: false,
})
export class CheckoutSuccessComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.router.navigate(['']);
    }, 5000);
  }

  goToDashboard(): void {
    this.router.navigate(['']);
  }
}
