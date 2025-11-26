# 🚀 Quick Start Guide - SPA Dashboard

## Tóm Tắt Refactor

Dashboard đã được refactor thành **Single Page Application (SPA)** với modal-based interactions.

### ✨ Những Gì Đã Thay Đổi

| Trước                                     | Sau                                                  |
| ----------------------------------------- | ---------------------------------------------------- |
| ❌ Inline sidebar/topbar trong mỗi page   | ✅ MainLayoutComponent reusable                      |
| ❌ Navigate sang page mới để xem chi tiết | ✅ Modal popup hiển thị chi tiết                     |
| ❌ UI cơ bản, không có animations         | ✅ Gradient cards, hover effects, smooth transitions |
| ❌ Không có loading/empty states          | ✅ Loading spinner, empty states, error handling     |

---

## 🎯 Cách Sử Dụng

### 1. MainLayoutComponent (Reusable Layout)

Sử dụng cho **TẤT CẢ** các feature pages:

```typescript
// your-feature.component.ts
import { MainLayoutComponent } from '../../shared/components/layout/main-layout.component';

@Component({
  selector: 'app-your-feature',
  standalone: true,
  imports: [CommonModule, MainLayoutComponent],
  template: `
    <app-main-layout>
      <div class="p-6">
        <h1 class="text-2xl font-bold mb-6">Your Feature Page</h1>
        <!-- Your content here -->
      </div>
    </app-main-layout>
  `,
})
export class YourFeatureComponent {}
```

**Features**:

- ✅ Sidebar với navigation (auto-highlight active route)
- ✅ Topbar với user profile & logout
- ✅ Toggle sidebar button
- ✅ Responsive design

---

### 2. Modal Detail Pattern

Tạo modal components cho chi tiết entities:

```typescript
// entity-detail-modal.component.ts
import { ModalComponent } from '../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-entity-detail-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  template: `
    <app-modal
      [open]="open"
      [title]="'Entity Details'"
      [showFooter]="false"
      [size]="'lg'"
      (closed)="handleClose()"
    >
      <div *ngIf="loading">Loading...</div>
      <div *ngIf="!loading && detail">
        <!-- Your detail content -->
      </div>
    </app-modal>
  `,
})
export class EntityDetailModalComponent implements OnChanges {
  @Input() open = false;
  @Input() entityId: number | null = null;
  @Output() closed = new EventEmitter<void>();

  detail: any = null;
  loading = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] && this.open && this.entityId) {
      this.loadDetail();
    }
  }

  loadDetail(): void {
    this.loading = true;
    // Load from API...
    this.loading = false;
  }

  handleClose(): void {
    this.closed.emit();
  }
}
```

**Trong parent component**:

```typescript
// parent.component.ts
export class ParentComponent {
  showModal = false;
  selectedId: number | null = null;

  viewDetail(id: number): void {
    this.selectedId = id;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedId = null;
  }
}

// parent.component.html
<button (click)="viewDetail(item.id)">View Details</button>

<app-entity-detail-modal
  [open]="showModal"
  [entityId]="selectedId"
  (closed)="closeModal()"
/>
```

---

### 3. Interactive Cards Pattern

Gradient KPI cards với hover effects:

```html
<div
  class="bg-gradient-to-br from-sky-500 to-sky-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
  (click)="onCardClick()"
>
  <div class="flex items-start justify-between">
    <div>
      <div class="text-sky-100 text-sm font-medium mb-2">Card Title</div>
      <div class="text-3xl font-bold mb-1">{{ value }}</div>
      <div class="text-sky-100 text-xs">Click to view details</div>
    </div>
    <div class="bg-white/20 p-3 rounded-lg">
      <!-- Icon SVG here -->
    </div>
  </div>
</div>
```

**Color Variants**:

- Sky: `from-sky-500 to-sky-600`
- Green: `from-green-500 to-green-600`
- Purple: `from-purple-500 to-purple-600`
- Amber: `from-amber-500 to-amber-600`

---

### 4. Status Badges

Color-coded status badges:

```typescript
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
```

```html
<span
  class="inline-block px-3 py-1 rounded-full text-xs font-semibold"
  [ngClass]="getStatusClass(item.status)"
>
  {{ item.status }}
</span>
```

---

### 5. Quick Action Cards

Interactive cards với icons:

```html
<a
  routerLink="/feature"
  class="flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-sky-500 hover:bg-sky-50 transition-all group"
>
  <div
    class="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors"
  >
    📦
  </div>
  <div>
    <div class="font-semibold text-slate-800 group-hover:text-sky-700">Feature Name</div>
    <div class="text-xs text-slate-500">Description</div>
  </div>
</a>
```

---

## 🎨 Custom Animations

Sử dụng các animation classes có sẵn:

```html
<!-- Fade in -->
<div class="animate-fade-in">Content</div>

<!-- Slide in from right -->
<div class="animate-slide-in-right">Content</div>

<!-- Slow pulse (for notifications) -->
<div class="animate-pulse-slow">
  <span class="w-2 h-2 bg-red-500 rounded-full"></span>
</div>
```

**Hover Effects** (có sẵn globally):

```html
<button class="hover:shadow-xl hover:-translate-y-1 transition-all duration-300">Hover me</button>
```

---

## 📋 Loading & Empty States

### Loading State

```html
<div *ngIf="loading" class="flex justify-center items-center py-12">
  <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
</div>
```

### Empty State

```html
<div *ngIf="!loading && items.length === 0" class="text-center py-12">
  <div class="text-slate-400 text-4xl mb-3">📦</div>
  <div class="text-slate-600 font-medium">No items yet</div>
  <div class="text-slate-500 text-sm">Items will appear here</div>
</div>
```

### Error State

```html
<div *ngIf="error" class="text-center py-8">
  <div class="text-red-600 text-lg mb-2">⚠️ Error</div>
  <div class="text-slate-600">{{ error }}</div>
  <button
    (click)="retry()"
    class="mt-4 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
  >
    Retry
  </button>
</div>
```

---

## 🔥 Best Practices

### 1. Always Use MainLayoutComponent

```typescript
// ✅ Good
<app-main-layout>
  <div class="p-6">Content</div>
</app-main-layout>

// ❌ Bad - Don't create your own sidebar/topbar
<aside>...</aside>
<div>Content</div>
```

### 2. Modal for Details, Navigate for Full Pages

```typescript
// ✅ Good - Quick view in modal
viewDetails(id: number) {
  this.showModal = true;
  this.selectedId = id;
}

// ✅ Good - Navigate for editing
editItem(id: number) {
  this.router.navigate(['/items', id, 'edit']);
}
```

### 3. Always Handle Loading & Error States

```typescript
// ✅ Good
loadData(): void {
  this.loading = true;
  this.error = null;

  this.api.getData().subscribe({
    next: (data) => {
      this.data = data;
      this.loading = false;
    },
    error: (err) => {
      this.error = err.message;
      this.loading = false;
    }
  });
}
```

### 4. Use Color Palette Consistently

```scss
// ✅ Good - Use defined colors
bg-sky-600     // Primary actions
bg-green-600   // Success
bg-red-600     // Danger
bg-amber-500   // Warning
bg-purple-600  // Additional features

// ❌ Bad - Don't use random colors
bg-blue-500
bg-yellow-400
```

### 5. Add Smooth Transitions

```html
<!-- ✅ Good - Smooth hover effects -->
<button class="bg-sky-600 hover:bg-sky-700 transition-all duration-300">Click me</button>

<!-- ❌ Bad - No transition -->
<button class="bg-sky-600 hover:bg-sky-700">Click me</button>
```

---

## 🚦 Testing Checklist

Khi tạo feature mới với pattern này:

- [ ] Sử dụng MainLayoutComponent
- [ ] Modal có loading state
- [ ] Modal có error handling với retry button
- [ ] Modal đóng đúng cách (emit closed event)
- [ ] Cards có hover effects
- [ ] Buttons có transitions
- [ ] Status badges có màu phù hợp
- [ ] Empty states có message rõ ràng
- [ ] Responsive design (mobile/tablet)
- [ ] Không có console errors
- [ ] Không có linter errors

---

## 🎓 Examples

### Example 1: Product List với Modal Detail

```typescript
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, MainLayoutComponent, ProductDetailModalComponent],
  template: `
    <app-main-layout>
      <div class="p-6">
        <h1 class="text-2xl font-bold mb-6">Products</h1>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            *ngFor="let product of products"
            class="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer"
            (click)="viewDetail(product.id)"
          >
            <h3 class="font-semibold">{{ product.name }}</h3>
            <p class="text-slate-500 text-sm">{{ product.price | currency }}</p>
          </div>
        </div>
      </div>

      <app-product-detail-modal
        [open]="showModal"
        [productId]="selectedId"
        (closed)="closeModal()"
      />
    </app-main-layout>
  `,
})
export class ProductListComponent {
  products: Product[] = [];
  showModal = false;
  selectedId: number | null = null;

  viewDetail(id: number): void {
    this.selectedId = id;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedId = null;
  }
}
```

### Example 2: KPI Card với Click Action

```html
<div
  class="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
  (click)="showOrdersModal()"
>
  <div class="flex items-start justify-between">
    <div>
      <div class="text-green-100 text-sm font-medium mb-2">Total Orders</div>
      <div class="text-3xl font-bold mb-1">{{ ordersCount }}</div>
      <div class="text-green-100 text-xs">Click to view all</div>
    </div>
    <div class="bg-white/20 p-3 rounded-lg">🛒</div>
  </div>
</div>
```

---

## 🆘 Troubleshooting

### Modal không hiển thị?

- Kiểm tra `[open]="showModal"` binding
- Kiểm tra ModalComponent đã import chưa

### Animations không hoạt động?

- Kiểm tra `styles.scss` đã có custom animations
- Restart dev server: `ng serve`

### Hover effects không mượt?

- Thêm `transition-all duration-300`
- Kiểm tra global transitions trong `styles.scss`

### Colors không đúng?

- Kiểm tra `@theme` trong `styles.scss`
- Tailwind v4 require colors trong `@theme` block

---

**Need Help?** Xem chi tiết tại [DASHBOARD_REFACTOR.md](./DASHBOARD_REFACTOR.md)

**Happy Coding! 🚀**
