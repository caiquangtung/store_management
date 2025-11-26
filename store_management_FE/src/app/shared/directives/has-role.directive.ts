import { Directive, Input, TemplateRef, ViewContainerRef, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService, User } from '../../features/auth/auth.service';

@Directive({
  selector: '[appHasRole]',
  standalone: true,
})
export class HasRoleDirective {
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  private roles: string[] = [];
  private currentUser: User | null = null;

  constructor(private tpl: TemplateRef<unknown>, private viewContainer: ViewContainerRef) {
    this.authService.currentUser$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((user) => {
      this.currentUser = user;
      this.updateView();
    });
  }

  @Input()
  set appHasRole(value: string | string[]) {
    this.roles = Array.isArray(value) ? value : [value];
    this.updateView();
  }

  private updateView(): void {
    if (!this.roles.length) {
      this.viewContainer.clear();
      this.viewContainer.createEmbeddedView(this.tpl);
      return;
    }

    const userRole = this.currentUser?.role;
    const hasPermission =
      !!userRole && this.roles.some((role) => role === userRole || role === '*');

    this.viewContainer.clear();

    if (hasPermission) {
      this.viewContainer.createEmbeddedView(this.tpl);
    }
  }
}
