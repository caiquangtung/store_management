import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PAGE_SIZE_OPTIONS } from '../../../types/pagination';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between text-sm">
      <div class="flex items-center gap-2">
        <span>Rows per page:</span>
        <select
          class="rounded border border-slate-300 px-2 py-1 text-sm"
          [disabled]="disabled"
          [value]="pageSize"
          (change)="onPageSizeChange($any($event.target).value)"
        >
          <option *ngFor="let option of pageSizeOptions" [value]="option">
            {{ option }}
          </option>
        </select>
      </div>

      <div class="flex items-center gap-4 justify-between md:justify-end">
        <span class="text-slate-500">
          {{ startIndex + 1 }}-{{ endIndex }} of {{ totalCount | number : '1.0-0' }}
        </span>

        <div class="flex items-center gap-1">
          <button
            type="button"
            class="rounded border border-slate-300 px-3 py-1 disabled:opacity-50"
            (click)="changePage(pageNumber - 1)"
            [disabled]="disabled || pageNumber <= 1"
          >
            ‹
          </button>
          <button
            type="button"
            class="rounded border border-slate-300 px-3 py-1 disabled:opacity-50"
            (click)="changePage(pageNumber + 1)"
            [disabled]="disabled || pageNumber >= totalPages"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  `,
})
export class PaginationComponent {
  @Input() pageNumber = 1;
  @Input() pageSize = PAGE_SIZE_OPTIONS[0];
  @Input() totalCount = 0;
  @Input() pageSizeOptions = PAGE_SIZE_OPTIONS;
  @Input() disabled = false;

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalCount / this.pageSize) || 1);
  }

  get startIndex(): number {
    if (!this.totalCount) {
      return 0;
    }
    return (this.pageNumber - 1) * this.pageSize;
  }

  get endIndex(): number {
    if (!this.totalCount) {
      return 0;
    }
    return Math.min(this.startIndex + this.pageSize, this.totalCount);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.pageNumber) {
      return;
    }
    this.pageChange.emit(page);
  }

  onPageSizeChange(rawValue: string): void {
    const value = Number(rawValue);
    if (!Number.isFinite(value) || value <= 0) {
      return;
    }

    this.pageSizeChange.emit(value);
  }
}
