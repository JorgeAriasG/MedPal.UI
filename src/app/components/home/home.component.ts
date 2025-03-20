import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    standalone: false
})
export class HomeComponent implements OnInit {
  ngOnInit(): void {
    const ctx = (document.getElementById('healthChart') as HTMLCanvasElement).getContext('2d');
    new Chart(ctx!, {
      type: 'line',
      data: {
        labels: ['2020', '2021', '2022', '2023'],
        datasets: [{
          label: 'Health Average',
          data: [85, 90, 75, 80],
          borderColor: 'rgba(75, 192, 192, 1)',
          fill: false,
        }]
      }
    });
  }
}
