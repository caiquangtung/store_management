import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MainLayoutComponent } from '../../shared/components/layout/main-layout.component';
import { OrderDetailModalComponent } from './components/order-detail-modal.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { DashboardService, RecentOrder, Kpis } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MainLayoutComponent,
    OrderDetailModalComponent,
    IconComponent,
  ],
  template: `
    <app-main-layout>
      <div class="p-6 space-y-6">
        <!-- KPI Cards with Hover Effects & Animations -->
        <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Total Sales Card -->
          <div
            class="bg-gradient-to-br from-sky-500 to-sky-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            (click)="showKpiDetail('sales')"
          >
            <div class="flex items-start justify-between">
              <div>
                <div class="text-sky-100 text-sm font-medium mb-2">Total Sales</div>
                <div class="text-3xl font-bold mb-1">
                  \${{ kpis.totalSales | number : '1.2-2' }}
                </div>
                <div class="text-sky-100 text-xs">Click to view details</div>
              </div>
              <div class="bg-white/20 p-3 rounded-lg">
                <app-icon name="payments" [size]="32" customClass="text-white"></app-icon>
              </div>
            </div>
          </div>

          <!-- Orders Card -->
          <div
            class="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            (click)="showKpiDetail('orders')"
          >
            <div class="flex items-start justify-between">
              <div>
                <div class="text-green-100 text-sm font-medium mb-2">Total Orders</div>
                <div class="text-3xl font-bold mb-1">{{ kpis.ordersCount }}</div>
                <div class="text-green-100 text-xs">Click to view all</div>
              </div>
              <div class="bg-white/20 p-3 rounded-lg">
                <app-icon name="shopping_bag" [size]="32" customClass="text-white"></app-icon>
              </div>
            </div>
          </div>

          <!-- Customers Card -->
          <div
            class="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            (click)="showKpiDetail('customers')"
          >
            <div class="flex items-start justify-between">
              <div>
                <div class="text-purple-100 text-sm font-medium mb-2">Active Customers</div>
                <div class="text-3xl font-bold mb-1">{{ kpis.customersCount }}</div>
                <div class="text-purple-100 text-xs">Click to manage</div>
              </div>
              <div class="bg-white/20 p-3 rounded-lg">
                <app-icon name="groups" [size]="32" customClass="text-white"></app-icon>
              </div>
            </div>
          </div>
        </section>

        <!-- Recent Orders & Quick Actions -->
        <section class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Recent Orders Table -->
          <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200">
            <div class="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 class="text-lg font-semibold text-slate-800">Recent Orders</h3>
              <button
                class="text-sm text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1"
              >
                View All
                <app-icon name="arrow_forward" [size]="16" customClass="text-sky-600"></app-icon>
              </button>
            </div>

            <div *ngIf="isLoading" class="p-12 text-center">
              <div
                class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"
              ></div>
              <div class="text-slate-500 mt-2">Loading orders...</div>
            </div>

            <div *ngIf="!isLoading && recentOrders.length === 0" class="p-12 text-center">
              <app-icon name="inbox" [size]="64" customClass="text-slate-400 mb-3"></app-icon>
              <div class="text-slate-600 font-medium">No orders yet</div>
              <div class="text-slate-500 text-sm">Orders will appear here</div>
            </div>

            <div *ngIf="!isLoading && recentOrders.length > 0" class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="text-slate-500 bg-slate-50 border-b border-slate-200">
                    <th class="text-left px-6 py-3 font-semibold">Order ID</th>
                    <th class="text-left px-6 py-3 font-semibold">Customer</th>
                    <th class="text-right px-6 py-3 font-semibold">Total</th>
                    <th class="text-center px-6 py-3 font-semibold">Status</th>
                    <th class="text-center px-6 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    *ngFor="let order of recentOrders"
                    class="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td class="px-6 py-4 font-medium text-slate-700">#{{ order.id }}</td>
                    <td class="px-6 py-4 text-slate-600">{{ order.customer }}</td>
                    <td class="px-6 py-4 text-right font-semibold text-slate-800">
                      {{ order.total }}
                    </td>
                    <td class="px-6 py-4 text-center">
                      <span
                        class="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                        [ngClass]="getStatusClass(order.status)"
                      >
                        {{ order.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <button
                        (click)="viewOrderDetail(order.id)"
                        class="text-sky-600 hover:text-sky-700 font-medium text-sm hover:underline"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Quick Actions -->
          <aside class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 class="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
            <div class="space-y-3">
              <a
                routerLink="/products"
                class="flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-sky-500 hover:bg-sky-50 transition-all group"
              >
                <div
                  class="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center text-sky-600 group-hover:bg-sky-600 transition-colors"
                >
                  <app-icon
                    name="inventory_2"
                    [size]="24"
                    customClass="text-current group-hover:text-white"
                  ></app-icon>
                </div>
                <div>
                  <div class="font-semibold text-slate-800 group-hover:text-sky-700">Products</div>
                  <div class="text-xs text-slate-500">Manage inventory</div>
                </div>
              </a>

              <a
                routerLink="/orders"
                class="flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-green-500 hover:bg-green-50 transition-all group"
              >
                <div
                  class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 group-hover:bg-green-600 transition-colors"
                >
                  <app-icon
                    name="receipt_long"
                    [size]="24"
                    customClass="text-current group-hover:text-white"
                  ></app-icon>
                </div>
                <div>
                  <div class="font-semibold text-slate-800 group-hover:text-green-700">Orders</div>
                  <div class="text-xs text-slate-500">View all orders</div>
                </div>
              </a>

              <a
                routerLink="/customers"
                class="flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-purple-500 hover:bg-purple-50 transition-all group"
              >
                <div
                  class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 group-hover:bg-purple-600 transition-colors"
                >
                  <app-icon
                    name="people"
                    [size]="24"
                    customClass="text-current group-hover:text-white"
                  ></app-icon>
                </div>
                <div>
                  <div class="font-semibold text-slate-800 group-hover:text-purple-700">
                    Customers
                  </div>
                  <div class="text-xs text-slate-500">Manage customers</div>
                </div>
              </a>

              <a
                routerLink="/promotions"
                class="flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-amber-500 hover:bg-amber-50 transition-all group"
              >
                <div
                  class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 group-hover:bg-amber-600 transition-colors"
                >
                  <app-icon
                    name="local_offer"
                    [size]="24"
                    customClass="text-current group-hover:text-white"
                  ></app-icon>
                </div>
                <div>
                  <div class="font-semibold text-slate-800 group-hover:text-amber-700">
                    Promotions
                  </div>
                  <div class="text-xs text-slate-500">Manage offers</div>
                </div>
              </a>
            </div>
          </aside>
        </section>
      </div>

      <!-- Order Detail Modal -->
      <app-order-detail-modal
        [open]="showOrderModal"
        [orderId]="selectedOrderId"
        (closed)="closeOrderModal()"
      />
    </app-main-layout>
  `,
  styles: [],
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  recentOrders: RecentOrder[] = [];
  kpis: Kpis = { totalSales: 0, ordersCount: 0, customersCount: 0 };
  isLoading = false;

  // Modal state
  showOrderModal = false;
  selectedOrderId: number | null = null;

  ngOnInit(): void {
    this.loadDashboard();
  }

  private loadDashboard(): void {
    this.isLoading = true;
    this.dashboardService.getCounts().subscribe({
      next: (k) => {
        this.kpis = k;
      },
      error: (e) => console.error('Failed to load kpis', e),
    });

    this.dashboardService.getRecentOrders().subscribe({
      next: (orders) => {
        this.recentOrders = orders;
        this.isLoading = false;
      },
      error: (e) => {
        console.error('Failed to load recent orders', e);
        this.isLoading = false;
      },
    });
  }

  viewOrderDetail(orderId: number): void {
    this.selectedOrderId = orderId;
    this.showOrderModal = true;
  }

  closeOrderModal(): void {
    this.showOrderModal = false;
    this.selectedOrderId = null;
  }

  showKpiDetail(type: string): void {
    // Future: Show detailed modal for each KPI
    console.log('Show details for:', type);
  }

  getStatusClass(status: string): string {
    const statusLower = status.toLowerCase();
    if (statusLower === 'completed' || statusLower === 'paid') {
      return 'bg-green-100 text-green-700';
    } else if (statusLower === 'pending' || statusLower === 'draft') {
      return 'bg-amber-100 text-amber-700';
    } else if (statusLower === 'cancelled' || statusLower === 'failed') {
      return 'bg-red-100 text-red-700';
    }
    return 'bg-slate-100 text-slate-700';
  }
}
