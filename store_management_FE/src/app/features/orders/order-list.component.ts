import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h2 class="text-xl font-semibold mb-4">Orders</h2>
      <div class="bg-white p-4 rounded shadow">
        <p class="text-sm text-slate-500">
          Placeholder order list. Connect to API for real orders.
        </p>
        <ul class="mt-4 space-y-2">
          <li class="p-2 border rounded">Order #1001 - $99.00</li>
          <li class="p-2 border rounded">Order #1002 - $45.50</li>
        </ul>
      </div>
    </div>
  `,
})
export class OrderListComponent {}
