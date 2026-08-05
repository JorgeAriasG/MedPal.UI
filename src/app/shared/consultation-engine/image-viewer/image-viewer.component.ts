import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ImageViewerData {
  url: string;
  title?: string;
}

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.css'],
  standalone: false,
})
export class ImageViewerComponent {
  zoom = 1;
  rotation = 0;

  constructor(@Inject(MAT_DIALOG_DATA) public data: ImageViewerData) {}

  zoomIn(): void {
    this.zoom = Math.min(this.zoom + 0.25, 4);
  }

  zoomOut(): void {
    this.zoom = Math.max(this.zoom - 0.25, 0.25);
  }

  rotate(): void {
    this.rotation = (this.rotation + 90) % 360;
  }

  reset(): void {
    this.zoom = 1;
    this.rotation = 0;
  }
}
