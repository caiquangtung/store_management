import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h2 class="text-xl font-semibold mb-4">Products</h2>
      <div class="bg-white p-4 rounded shadow">
        <p class="text-sm text-slate-500">
          This is a placeholder product list. Connect to API to fetch real data.
        </p>
        <ul class="mt-4 space-y-2">
          <li class="p-2 border rounded">Sample Product A</li>
          <li class="p-2 border rounded">Sample Product B</li>
        </ul>
      </div>
    </div>
  `,
})
export class ProductListComponent {}
