import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: number;
  message: string;
  title?: string;
  type: ToastType;
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly toastsSubject = new BehaviorSubject<ToastMessage[]>([]);
  readonly toasts$ = this.toastsSubject.asObservable();

  private idCounter = 0;

  show(message: string, options?: { title?: string; type?: ToastType; duration?: number }): number {
    const toast: ToastMessage = {
      id: ++this.idCounter,
      message,
      title: options?.title,
      type: options?.type ?? 'info',
      duration: options?.duration ?? 4000,
    };

    const nextToasts = [...this.toastsSubject.value, toast];
    this.toastsSubject.next(nextToasts);

    if (toast.duration && toast.duration > 0) {
      setTimeout(() => this.dismiss(toast.id), toast.duration);
    }

    return toast.id;
  }

  success(message: string, title = 'Success', duration?: number): number {
    return this.show(message, { title, type: 'success', duration });
  }

  error(message: string, title = 'Error', duration?: number): number {
    return this.show(message, { title, type: 'error', duration });
  }

  info(message: string, title = 'Info', duration?: number): number {
    return this.show(message, { title, type: 'info', duration });
  }

  warning(message: string, title = 'Warning', duration?: number): number {
    return this.show(message, { title, type: 'warning', duration });
  }

  dismiss(id: number): void {
    const filtered = this.toastsSubject.value.filter((toast) => toast.id !== id);
    this.toastsSubject.next(filtered);
  }

  clear(): void {
    this.toastsSubject.next([]);
  }
}
