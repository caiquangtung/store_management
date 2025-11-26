import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h2 class="text-xl font-semibold mb-4">Customers</h2>
      <div class="bg-white p-4 rounded shadow">
        <p class="text-sm text-slate-500">
          Placeholder customer list. Connect to API for real customers.
        </p>
        <ul class="mt-4 space-y-2">
          <li class="p-2 border rounded">Customer: John Doe</li>
          <li class="p-2 border rounded">Customer: Jane Smith</li>
        </ul>
      </div>
    </div>
  `,
})
export class CustomerListComponent {}
