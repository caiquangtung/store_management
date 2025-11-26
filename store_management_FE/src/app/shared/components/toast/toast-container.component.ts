import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastMessage, ToastService } from './toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-3 px-4 sm:items-end sm:px-6"
    >
      <div
        *ngFor="let toast of toasts"
        class="w-full max-w-sm rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 ring-1 ring-black/5"
        [ngClass]="toastClasses(toast.type)"
      >
        <div class="flex items-start gap-3 px-4 py-3">
          <div class="flex-1">
            <p class="text-sm font-semibold">{{ toast.title ?? defaultTitle(toast.type) }}</p>
            <p class="mt-1 text-sm text-slate-600">
              {{ toast.message }}
            </p>
          </div>
          <button
            type="button"
            class="text-slate-400 transition hover:text-slate-600"
            (click)="dismiss(toast.id)"
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ToastContainerComponent implements OnInit, OnDestroy {
  toasts: ToastMessage[] = [];
  private subscription?: Subscription;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.subscription = this.toastService.toasts$.subscribe((items) => (this.toasts = items));
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  dismiss(id: number): void {
    this.toastService.dismiss(id);
  }

  toastClasses(type: ToastMessage['type']): string {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-amber-200 bg-amber-50';
      default:
        return 'border-slate-200 bg-white';
    }
  }

  defaultTitle(type: ToastMessage['type']): string {
    switch (type) {
      case 'success':
        return 'Success';
      case 'error':
        return 'Error';
      case 'warning':
        return 'Warning';
      default:
        return 'Information';
    }
  }
}
