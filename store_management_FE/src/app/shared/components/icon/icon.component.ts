import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type IconStyle = 'outlined' | 'filled' | 'rounded' | 'sharp' | 'two-tone';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      [class]="iconClass"
      [ngClass]="customClass"
      [style.font-size.px]="size"
      [attr.aria-label]="name"
    >
      {{ name }}
    </span>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
    `,
  ],
})
export class IconComponent {
  @Input() name = '';
  @Input() size = 24;
  @Input() style: IconStyle = 'outlined';
  @Input() customClass = '';

  get iconClass(): string {
    switch (this.style) {
      case 'filled':
        return 'material-icons';
      case 'outlined':
        return 'material-symbols-outlined';
      case 'rounded':
        return 'material-icons-round';
      case 'sharp':
        return 'material-icons-sharp';
      case 'two-tone':
        return 'material-icons-two-tone';
      default:
        return 'material-symbols-outlined';
    }
  }
}
