import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-center" [class.min-h-[120px]]="expand">
      <div
        class="h-8 w-8 animate-spin rounded-full border-2 border-sky-500 border-t-transparent"
      ></div>
      <span class="ml-3 text-sm text-slate-500" *ngIf="label">{{ label }}</span>
    </div>
  `,
})
export class LoadingSpinnerComponent {
  @Input() label?: string;
  @Input() expand = false;
}
