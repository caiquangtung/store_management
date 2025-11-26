import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginationComponent } from '../pagination/pagination.component';

export type ColumnAlignment = 'left' | 'center' | 'right';

export interface DataTableColumn<T extends Record<string, unknown> = Record<string, unknown>> {
  key: keyof T | string;
  label: string;
  width?: string;
  align?: ColumnAlignment;
  sortable?: boolean;
  formatter?: (row: T) => string | number | null | undefined;
}

export interface DataTableAction<T extends Record<string, unknown> = Record<string, unknown>> {
  id: string;
  label: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  show?: (row: T) => boolean;
  disabled?: (row: T) => boolean;
}

export interface SortState {
  active?: string;
  direction?: 'asc' | 'desc';
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, PaginationComponent],
  template: `
    <div class="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div class="overflow-auto">
        <table class="min-w-full divide-y divide-slate-200 text-sm">
          <thead
            class="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
          >
            <tr>
              <th
                *ngFor="let column of columns"
                scope="col"
                class="px-4 py-3"
                [style.width]="column.width"
                [class.cursor-pointer]="column.sortable"
                (click)="onSort(column)"
              >
                <div class="flex items-center gap-1" [class.justify-end]="column.align === 'right'">
                  <span>{{ column.label }}</span>
                  <span *ngIf="column.sortable" class="text-slate-400 text-xs">
                    <ng-container *ngIf="sortState.active === column.key; else sortIcon">
                      {{ sortState.direction === 'desc' ? '▼' : '▲' }}
                    </ng-container>
                    <ng-template #sortIcon>⇅</ng-template>
                  </span>
                </div>
              </th>
              <th *ngIf="actions?.length" class="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            <tr *ngIf="loading">
              <td
                [attr.colspan]="columns.length + (actions.length ? 1 : 0)"
                class="px-4 py-6 text-center"
              >
                Loading...
              </td>
            </tr>
            <tr *ngIf="!loading && !data?.length">
              <td
                [attr.colspan]="columns.length + (actions.length ? 1 : 0)"
                class="px-4 py-6 text-center text-slate-500"
              >
                {{ emptyState }}
              </td>
            </tr>
            <tr
              *ngFor="let row of data; trackBy: trackByFn"
              (click)="onRowClick(row)"
              [class.cursor-pointer]="clickableRows"
              class="hover:bg-slate-50 transition-colors"
            >
              <td
                *ngFor="let column of columns"
                class="px-4 py-3"
                [class.text-right]="column.align === 'right'"
                [class.text-center]="column.align === 'center'"
              >
                {{ resolveValue(row, column) }}
              </td>
              <td *ngIf="actions?.length" class="px-4 py-3 text-right">
                <div class="flex flex-wrap justify-end gap-2">
                  <ng-container *ngFor="let action of actions">
                    <button
                      *ngIf="action.show ? action.show(row) : true"
                      type="button"
                      class="rounded px-3 py-1 text-xs font-semibold transition"
                      [ngClass]="buttonClass(action.variant)"
                      (click)="onAction(action, row, $event)"
                      [disabled]="action.disabled?.(row)"
                    >
                      <span *ngIf="action.icon" class="mr-1">{{ action.icon }}</span>
                      {{ action.label }}
                    </button>
                  </ng-container>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="border-t border-slate-200 bg-slate-50 px-4 py-3" *ngIf="showPagination">
        <app-pagination
          [pageNumber]="pageNumber"
          [pageSize]="pageSize"
          [totalCount]="totalCount"
          [pageSizeOptions]="pageSizeOptions"
          [disabled]="loading"
          (pageChange)="pageChange.emit($event)"
          (pageSizeChange)="pageSizeChange.emit($event)"
        />
      </div>
    </div>
  `,
})
export class DataTableComponent<T extends Record<string, unknown> = Record<string, unknown>> {
  @Input() columns: DataTableColumn<T>[] = [];
  @Input() data: T[] = [];
  @Input() loading = false;
  @Input() emptyState = 'No records found';
  @Input() clickableRows = false;
  @Input() sortState: SortState = { active: undefined, direction: undefined };
  @Input() actions: DataTableAction<T>[] = [];

  @Input() showPagination = true;
  @Input() pageNumber = 1;
  @Input() pageSize = 10;
  @Input() totalCount = 0;
  @Input() pageSizeOptions = [10, 25, 50];

  @Output() rowClick = new EventEmitter<T>();
  @Output() sortChange = new EventEmitter<SortState>();
  @Output() actionTriggered = new EventEmitter<{ action: DataTableAction<T>; row: T }>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  resolveValue(row: T, column: DataTableColumn<T>): string | number | null | undefined {
    if (column.formatter) {
      return column.formatter(row);
    }

    const key = column.key as keyof T;
    const value = row?.[key];
    if (value === undefined || value === null || value === '') {
      return '--';
    }

    return value as string | number;
  }

  onRowClick(row: T): void {
    if (!this.clickableRows) {
      return;
    }
    this.rowClick.emit(row);
  }

  onSort(column: DataTableColumn<T>): void {
    if (!column.sortable) {
      return;
    }

    const key = column.key as string;
    let direction: 'asc' | 'desc' = 'asc';

    if (this.sortState.active === key && this.sortState.direction === 'asc') {
      direction = 'desc';
    }

    this.sortChange.emit({ active: key, direction });
  }

  onAction(action: DataTableAction<T>, row: T, event: MouseEvent): void {
    event.stopPropagation();
    if (action.disabled?.(row)) {
      return;
    }
    this.actionTriggered.emit({ action, row });
  }

  buttonClass(variant: DataTableAction['variant'] = 'secondary'): string {
    switch (variant) {
      case 'primary':
        return 'bg-sky-600 text-white hover:bg-sky-700';
      case 'danger':
        return 'bg-red-50 text-red-600 hover:bg-red-100';
      default:
        return 'bg-slate-100 text-slate-800 hover:bg-slate-200';
    }
  }

  trackByFn(_index: number, item: T): T {
    return item;
  }
}
