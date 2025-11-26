import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  template: `
    <app-modal
      [open]="visible"
      [title]="title"
      [size]="size"
      [primaryLabel]="confirmLabel"
      [secondaryLabel]="cancelLabel"
      [confirmLoading]="confirmLoading"
      (closed)="handleClose($event)"
    >
      <p class="text-sm text-slate-600 whitespace-pre-line">
        {{ message }}
      </p>
    </app-modal>
  `,
})
export class ConfirmDialogComponent {
  @Input() visible = false;
  @Input() title = 'Confirm Action';
  @Input() message = 'Are you sure you want to continue?';
  @Input() confirmLabel = 'Confirm';
  @Input() cancelLabel = 'Cancel';
  @Input() size: 'sm' | 'md' | 'lg' = 'sm';
  @Input() confirmLoading = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  handleClose(reason: 'confirm' | 'cancel' | 'dismiss'): void {
    if (reason === 'confirm') {
      this.confirm.emit();
      return;
    }
    this.cancel.emit();
  }
}
