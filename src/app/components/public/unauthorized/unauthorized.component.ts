/**
 * Unauthorized Component
 *
 * Displays access denied message when user lacks required permissions
 * Used by guards and interceptors when 403 Forbidden is encountered
 */

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class UnauthorizedComponent implements OnInit {
  returnUrl: string | null = null;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get return URL from query params if available
    this.activatedRoute.queryParams.subscribe((params) => {
      this.returnUrl = params['returnUrl'] || null;
    });

    console.warn('[UnauthorizedComponent] User attempted to access unauthorized resource');
  }

  /**
   * Navigate back to previous page or home
   */
  goBack(): void {
    if (this.returnUrl) {
      this.router.navigateByUrl(this.returnUrl);
    } else {
      this.router.navigate(['/']);
    }
  }

  /**
   * Navigate to home page
   */
  goHome(): void {
    this.router.navigate(['/']);
  }
}
