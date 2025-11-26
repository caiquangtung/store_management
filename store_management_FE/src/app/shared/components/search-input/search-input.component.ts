import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative w-full">
      <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        >🔍</span
      >
      <input
        type="text"
        class="w-full rounded border border-slate-300 bg-white py-2 pl-9 pr-8 text-sm placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
        [placeholder]="placeholder"
        [value]="value"
        (input)="handleInput($event.target.value)"
        [disabled]="disabled"
      />
      <button
        type="button"
        class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
        *ngIf="value && !disabled"
        (click)="clear()"
      >
        ✕
      </button>
    </div>
  `,
})
export class SearchInputComponent implements OnInit, OnDestroy {
  @Input() placeholder = 'Search...';
  @Input() debounce = 400;
  @Input() value = '';
  @Input() disabled = false;

  @Output() valueChange = new EventEmitter<string>();

  private input$ = new Subject<string>();
  private subscription?: Subscription;

  ngOnInit(): void {
    this.subscription = this.input$
      .pipe(debounceTime(this.debounce), distinctUntilChanged())
      .subscribe((term) => this.valueChange.emit(term));
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  handleInput(nextValue: string): void {
    this.value = nextValue;
    this.input$.next(nextValue);
  }

  clear(): void {
    this.handleInput('');
  }
}
