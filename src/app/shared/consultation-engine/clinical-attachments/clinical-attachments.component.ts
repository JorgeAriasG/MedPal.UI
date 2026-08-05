import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PendingAttachment } from 'src/app/entities/specialty-templates.model';
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';

@Component({
  selector: 'app-clinical-attachments',
  templateUrl: './clinical-attachments.component.html',
  styleUrls: ['./clinical-attachments.component.css'],
  standalone: false,
})
export class ClinicalAttachmentsComponent {
  @Input() attachments: PendingAttachment[] = [];
  @Input() disabled = false;
  @Output() attachmentsChange = new EventEmitter<PendingAttachment[]>();

  constructor(private dialog: MatDialog) {}

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const files: File[] = Array.from(input.files);
    const newAttachments: PendingAttachment[] = files.map((file) => {
      const previewable = file.type.startsWith('image/');
      return {
        id: this.generateId(),
        name: file.name,
        size: file.size,
        type: this.classifyFile(file),
        mimeType: file.type || 'application/octet-stream',
        file,
        objectUrl: previewable ? URL.createObjectURL(file) : undefined,
      };
    });

    this.attachments = [...this.attachments, ...newAttachments];
    this.attachmentsChange.emit(this.attachments);
    input.value = '';
  }

  remove(index: number): void {
    const removed = this.attachments[index];
    if (removed?.objectUrl) {
      URL.revokeObjectURL(removed.objectUrl);
    }
    this.attachments = this.attachments.filter((_, i) => i !== index);
    this.attachmentsChange.emit(this.attachments);
  }

  preview(attachment: PendingAttachment): void {
    if (attachment.objectUrl) {
      this.dialog.open(ImageViewerComponent, {
        data: { url: attachment.objectUrl, title: attachment.name },
        maxWidth: '90vw',
        width: '720px',
        panelClass: 'image-viewer-panel',
      });
      return;
    }

    if (attachment.file) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(attachment.file);
      link.download = attachment.name;
      link.click();
    }
  }

  formatSize(bytes: number): string {
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${bytes} B`;
  }

  private classifyFile(file: File): PendingAttachment['type'] {
    const mime = file.type || '';
    if (mime.startsWith('image/')) return 'photo';
    if (mime === 'application/pdf') return 'doc';
    return 'doc';
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
  }
}
