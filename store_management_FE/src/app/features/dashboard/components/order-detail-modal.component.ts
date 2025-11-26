import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ConfigService } from '../../../core/config.service';

interface OrderDetail {
  orderId: number;
  orderDate: string;
  customerName: string;
  customerPhone?: string;
  status: string;
  subtotal: number;
  discount: number;
  finalAmount: number;
  items: OrderItem[];
}

interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

@Component({
  selector: 'app-order-detail-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent, IconComponent],
  template: `
    <app-modal
      [open]="open"
      [title]="'Order Details #' + orderId"
      [showFooter]="false"
      [size]="'lg'"
      (closed)="handleClose()"
    >
      <div *ngIf="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>

      <div *ngIf="!loading && error" class="text-center py-8">
        <app-icon name="error" [size]="64" customClass="text-red-600 mb-2"></app-icon>
        <div class="text-red-600 text-lg mb-2">Error Loading Order</div>
        <div class="text-slate-600">{{ error }}</div>
        <button
          (click)="loadOrderDetail()"
          class="mt-4 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 flex items-center gap-2 mx-auto"
        >
          <app-icon name="refresh" [size]="20" customClass="text-white"></app-icon>
          Retry
        </button>
      </div>

      <div *ngIf="!loading && !error && orderDetail" class="space-y-6">
        <!-- Order Info -->
        <div class="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
          <div>
            <div class="text-sm text-slate-500">Order Date</div>
            <div class="font-semibold">{{ formatDate(orderDetail.orderDate) }}</div>
          </div>
          <div>
            <div class="text-sm text-slate-500">Status</div>
            <div>
              <span
                class="inline-block px-3 py-1 rounded-full text-sm font-semibold"
                [ngClass]="getStatusClass(orderDetail.status)"
              >
                {{ orderDetail.status }}
              </span>
            </div>
          </div>
          <div>
            <div class="text-sm text-slate-500">Customer</div>
            <div class="font-semibold">{{ orderDetail.customerName }}</div>
          </div>
          <div>
            <div class="text-sm text-slate-500">Phone</div>
            <div class="font-semibold">{{ orderDetail.customerPhone || 'N/A' }}</div>
          </div>
        </div>

        <!-- Order Items -->
        <div>
          <h3 class="text-lg font-semibold mb-3">Order Items</h3>
          <div class="border border-slate-200 rounded-lg overflow-hidden">
            <table class="w-full text-sm">
              <thead class="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th class="text-left px-4 py-3 text-slate-600 font-semibold">Product</th>
                  <th class="text-right px-4 py-3 text-slate-600 font-semibold">Quantity</th>
                  <th class="text-right px-4 py-3 text-slate-600 font-semibold">Unit Price</th>
                  <th class="text-right px-4 py-3 text-slate-600 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  *ngFor="let item of orderDetail.items; let i = index"
                  class="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  [class.border-b-0]="i === orderDetail.items.length - 1"
                >
                  <td class="px-4 py-3">{{ item.productName }}</td>
                  <td class="text-right px-4 py-3">{{ item.quantity }}</td>
                  <td class="text-right px-4 py-3">\${{ item.unitPrice.toFixed(2) }}</td>
                  <td class="text-right px-4 py-3 font-semibold">\${{ item.total.toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="border-t pt-4">
          <div class="space-y-2 max-w-sm ml-auto">
            <div class="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span>\${{ orderDetail.subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-slate-600">
              <span>Discount:</span>
              <span class="text-red-600">-\${{ orderDetail.discount.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-lg font-bold text-slate-800 pt-2 border-t">
              <span>Total:</span>
              <span class="text-sky-600">\${{ orderDetail.finalAmount.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3 pt-4">
          <button
            (click)="handleClose()"
            class="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors font-medium flex items-center gap-2"
          >
            <app-icon name="close" [size]="20"></app-icon>
            Close
          </button>
          <button
            class="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors font-medium flex items-center gap-2"
          >
            <app-icon name="print" [size]="20" customClass="text-white"></app-icon>
            Print Receipt
          </button>
        </div>
      </div>
    </app-modal>
  `,
})
export class OrderDetailModalComponent implements OnChanges {
  private readonly http = inject(HttpClient);
  private readonly config = inject(ConfigService);

  @Input() open = false;
  @Input() orderId: number | null = null;
  @Output() closed = new EventEmitter<void>();

  orderDetail: OrderDetail | null = null;
  loading = false;
  error: string | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] && this.open && this.orderId) {
      this.loadOrderDetail();
    }
  }

  loadOrderDetail(): void {
    if (!this.orderId) return;

    this.loading = true;
    this.error = null;
    const url = this.config.getApiUrl(`/orders/${this.orderId}`);

    this.http.get<any>(url).subscribe({
      next: (response) => {
        // Handle different response formats
        const data = response?.data || response;
        this.orderDetail = {
          orderId: data.orderId || data.id,
          orderDate: data.orderDate || data.createdAt || new Date().toISOString(),
          customerName: data.customerName || 'Unknown',
          customerPhone: data.customerPhone || data.phone,
          status: data.status || 'Pending',
          subtotal: data.subtotal || data.totalAmount || 0,
          discount: data.discount || data.discountAmount || 0,
          finalAmount: data.finalAmount || data.total || data.totalAmount || 0,
          items: (data.items || data.orderItems || []).map((item: any) => ({
            productName: item.productName || item.name || 'Unknown Product',
            quantity: item.quantity || 0,
            unitPrice: item.unitPrice || item.price || 0,
            total: item.total || item.quantity * item.unitPrice || 0,
          })),
        };
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Failed to load order details';
        this.loading = false;
      },
    });
  }

  handleClose(): void {
    this.closed.emit();
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
