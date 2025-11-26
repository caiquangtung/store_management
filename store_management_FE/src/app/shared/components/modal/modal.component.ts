import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 px-4"
      *ngIf="open"
      (click)="handleBackdropClick($event)"
    >
      <div
        class="max-h-[90vh] w-full overflow-hidden rounded-2xl bg-white shadow-2xl"
        [ngClass]="modalWidth"
        (click)="$event.stopPropagation()"
      >
        <header class="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div class="text-lg font-semibold text-slate-900">{{ title }}</div>
          <button
            type="button"
            class="text-slate-400 transition hover:text-slate-600"
            aria-label="Close"
            (click)="close('dismiss')"
            [disabled]="disableClose"
          >
            ✕
          </button>
        </header>

        <section class="max-h-[65vh] overflow-auto px-6 py-4 text-slate-700">
          <ng-content></ng-content>
        </section>

        <footer
          class="flex flex-col gap-3 border-t border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-end"
          *ngIf="showFooter"
        >
          <button
            type="button"
            class="w-full rounded border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 sm:w-auto"
            (click)="close('cancel')"
            [disabled]="disableClose"
          >
            {{ secondaryLabel }}
          </button>
          <button
            type="button"
            class="w-full rounded bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 sm:w-auto"
            (click)="close('confirm')"
            [disabled]="confirmLoading"
          >
            <span *ngIf="!confirmLoading">{{ primaryLabel }}</span>
            <span *ngIf="confirmLoading">Processing...</span>
          </button>
        </footer>
      </div>
    </div>
  `,
})
export class ModalComponent {
  @Input() open = false;
  @Input() title = '';
  @Input() size: ModalSize = 'md';
  @Input() showFooter = true;
  @Input() primaryLabel = 'Save';
  @Input() secondaryLabel = 'Cancel';
  @Input() confirmLoading = false;
  @Input() disableClose = false;

  @Output() closed = new EventEmitter<'confirm' | 'cancel' | 'dismiss'>();

  get modalWidth(): string {
    switch (this.size) {
      case 'sm':
        return 'max-w-md';
      case 'lg':
        return 'max-w-4xl';
      case 'xl':
        return 'max-w-5xl';
      default:
        return 'max-w-2xl';
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (!this.open || this.disableClose) {
      return;
    }
    this.close('dismiss');
  }

  handleBackdropClick(event: MouseEvent): void {
    if (this.disableClose) {
      event.stopPropagation();
      return;
    }
    this.close('dismiss');
  }

  close(reason: 'confirm' | 'cancel' | 'dismiss'): void {
    if (this.disableClose && reason !== 'confirm') {
      return;
    }
    this.closed.emit(reason);
  }
}
