import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService, User } from '../../../features/auth/auth.service';
import { IconComponent } from '../icon/icon.component';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  template: `
    <div class="min-h-screen flex bg-slate-50">
      <!-- Sidebar -->
      <aside
        class="w-64 bg-white border-r border-slate-200 flex flex-col transition-all duration-300"
        [class.hidden]="!sidebarOpen"
      >
        <!-- Logo -->
        <div class="p-6 border-b border-slate-200">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-sky-600 rounded-lg flex items-center justify-center text-white font-bold"
            >
              SM
            </div>
            <div>
              <h2 class="text-lg font-bold text-slate-800">StoreManagement</h2>
              <p class="text-xs text-slate-500">POS System</p>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
          <a
            *ngFor="let item of navItems"
            [routerLink]="item.route"
            routerLinkActive="bg-sky-50 text-sky-700 border-sky-600"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 transition-all border-l-4 border-transparent"
          >
            <app-icon [name]="item.icon" [size]="24" class="text-current"></app-icon>
            <span class="font-medium">{{ item.label }}</span>
          </a>
        </nav>

        <!-- User Profile (Bottom) -->
        <div class="p-4 border-t border-slate-200" *ngIf="user">
          <div class="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-50">
            <div
              class="w-9 h-9 bg-sky-600 rounded-full flex items-center justify-center text-white text-sm font-semibold"
            >
              {{ getUserInitials() }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-semibold text-slate-800 truncate">
                {{ user.fullName || user.username }}
              </div>
              <div class="text-xs text-slate-500 capitalize">{{ user.role }}</div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col min-w-0">
        <!-- Topbar -->
        <header class="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-30 shadow-sm">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <button
                (click)="toggleSidebar()"
                class="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600"
                aria-label="Toggle Sidebar"
              >
                <app-icon name="menu" [size]="24"></app-icon>
              </button>
              <h1 class="text-xl font-semibold text-slate-800">{{ pageTitle }}</h1>
            </div>

            <div class="flex items-center gap-3">
              <!-- Notifications -->
              <button
                class="relative p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600"
                title="Notifications"
              >
                <app-icon name="notifications" [size]="24"></app-icon>
                <span
                  class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"
                ></span>
              </button>

              <!-- Logout -->
              <button
                (click)="logout()"
                class="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium text-sm"
              >
                <app-icon name="logout" [size]="20" customClass="text-white"></app-icon>
                Logout
              </button>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1 overflow-auto">
          <ng-content></ng-content>
        </main>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class MainLayoutComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  user: User | null = null;
  sidebarOpen = true;
  pageTitle = 'Dashboard';

  navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'Products', route: '/products', icon: 'inventory_2' },
    { label: 'Orders', route: '/orders', icon: 'shopping_cart' },
    { label: 'Customers', route: '/customers', icon: 'people' },
    { label: 'Inventory', route: '/inventory', icon: 'warehouse' },
    { label: 'Promotions', route: '/promotions', icon: 'local_offer' },
  ];

  constructor() {
    this.user = this.auth.getCurrentUser();
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  getUserInitials(): string {
    if (!this.user) return '?';
    const name = this.user.fullName || this.user.username;
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}
