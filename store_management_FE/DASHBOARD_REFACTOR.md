# Dashboard Refactor - SPA Modal-Based Design

## 📋 Overview

Dashboard đã được refactor hoàn toàn theo hướng **Single Page Application (SPA)** với modal-based interactions, thay vì navigation sang các trang mới. Thiết kế mới tập trung vào:

- ✅ **UX tốt hơn**: Modal popups cho quick actions
- ✅ **Performance**: Giảm page reloads
- ✅ **Modern UI**: Gradients, animations, hover effects
- ✅ **Reusable Layout**: Main layout component có thể dùng cho các feature khác

---

## 🏗️ Architecture Changes

### 1. Main Layout Component (Reusable)

**File**: `src/app/shared/components/layout/main-layout.component.ts`

Layout component này có thể được reuse cho tất cả các feature pages:

```typescript
<app-main-layout>
  <!-- Your page content here -->
</app-main-layout>
```

**Features**:

- ✅ Responsive sidebar với toggle button
- ✅ Active route highlighting (RouterLinkActive)
- ✅ User profile display ở bottom sidebar
- ✅ Top navigation bar với notifications
- ✅ Logout button với icon
- ✅ Smooth animations và transitions

**Navigation Items**:

```typescript
navItems: NavItem[] = [
  { label: 'Dashboard', route: '/dashboard', icon: '📊' },
  { label: 'Products', route: '/products', icon: '📦' },
  { label: 'Orders', route: '/orders', icon: '🛒' },
  { label: 'Customers', route: '/customers', icon: '👥' },
  { label: 'Inventory', route: '/inventory', icon: '📋' },
  { label: 'Promotions', route: '/promotions', icon: '🎁' },
];
```

---

### 2. Order Detail Modal Component

**File**: `src/app/features/dashboard/components/order-detail-modal.component.ts`

Modal component hiển thị chi tiết đơn hàng thay vì navigate sang trang mới.

**Usage**:

```typescript
// In parent component
<app-order-detail-modal
  [open]="showOrderModal"
  [orderId]="selectedOrderId"
  (closed)="closeOrderModal()"
/>

// Trigger modal
viewOrderDetail(orderId: number): void {
  this.selectedOrderId = orderId;
  this.showOrderModal = true;
}
```

**Features**:

- ✅ Fetches order details from API: `GET /api/orders/{id}`
- ✅ Loading state với spinner
- ✅ Error handling với retry button
- ✅ Formatted order information (date, status, customer)
- ✅ Order items table với pricing details
- ✅ Order summary (subtotal, discount, total)
- ✅ Status badges với color coding
- ✅ Print receipt button (future implementation)

**API Response Handling**:

```typescript
// Handles multiple response formats from backend
const data = response?.data || response;
this.orderDetail = {
  orderId: data.orderId || data.id,
  orderDate: data.orderDate || data.createdAt,
  customerName: data.customerName || 'Unknown',
  status: data.status || 'Pending',
  finalAmount: data.finalAmount || data.total,
  items: (data.items || data.orderItems || []).map(...)
};
```

---

### 3. Refactored Dashboard Component

**File**: `src/app/features/dashboard/dashboard.component.ts`

**Key Changes**:

1. **Uses MainLayoutComponent** - No more inline sidebar/topbar
2. **Modal-based interactions** - Click "View Details" opens modal instead of navigation
3. **Interactive KPI cards** - Clickable cards with hover effects
4. **Modern Quick Actions** - Card-based design with hover states

**KPI Cards** (Clickable with Gradients):

```typescript
// Each KPI card can trigger modal or navigate
showKpiDetail(type: string): void {
  // Future: Show detailed modal for sales, orders, customers
  console.log('Show details for:', type);
}
```

**Recent Orders Table**:

```typescript
// Click to view details in modal
viewOrderDetail(orderId: number): void {
  this.selectedOrderId = orderId;
  this.showOrderModal = true;
}
```

---

## 🎨 UI/UX Improvements

### 1. KPI Cards (Gradient Design)

**Before**: Plain white cards with basic text
**After**: Colorful gradient cards with icons and hover effects

```html
<!-- Sky Blue - Total Sales -->
<div class="bg-gradient-to-br from-sky-500 to-sky-600 text-white ...">
  <div>Total Sales: $XXX</div>
  <svg>💵</svg>
</div>

<!-- Green - Orders -->
<div class="bg-gradient-to-br from-green-500 to-green-600 ...">
  <!-- Purple - Customers -->
  <div class="bg-gradient-to-br from-purple-500 to-purple-600 ..."></div>
</div>
```

**Hover Effects**:

- `hover:shadow-xl` - Enhanced shadow on hover
- `hover:-translate-y-1` - Lift effect
- `transition-all duration-300` - Smooth animation

---

### 2. Recent Orders Table

**Features**:

- ✅ Loading state với spinner animation
- ✅ Empty state với emoji và message
- ✅ Hover effect trên rows (`hover:bg-slate-50`)
- ✅ Status badges với color coding
- ✅ "View Details" button mở modal

**Status Color Mapping**:

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

---

### 3. Quick Actions Cards

**Before**: Simple text links
**After**: Interactive cards với icons và hover effects

```html
<a routerLink="/products" class="... hover:border-sky-500 hover:bg-sky-50 ...">
  <div class="bg-sky-100 ... group-hover:bg-sky-600 group-hover:text-white">📦</div>
  <div>
    <div>Products</div>
    <div>Manage inventory</div>
  </div>
</a>
```

**Hover States**:

- Border color thay đổi theo feature theme
- Background color highlight
- Icon background transitions to solid color
- Text color changes

---

## 🎭 Animations & Effects

### Custom Animations (styles.scss)

```scss
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse-slow {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
```

**Usage Classes**:

- `.animate-fade-in` - Smooth fade in with slight upward movement
- `.animate-slide-in-right` - Slide in from right
- `.animate-pulse-slow` - Slow pulsing effect (for notifications)

### Custom Scrollbar

```scss
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
```

### Global Transitions

```scss
button,
a,
input,
select,
textarea {
  transition: all 0.15s ease-in-out;
}
```

---

## 🎨 Color Palette Updates

### New Colors Added

```scss
@theme {
  /* Purple - For Customers KPI */
  --color-purple-50: #faf5ff;
  --color-purple-100: #f3e8ff;
  --color-purple-500: #a855f7;
  --color-purple-600: #9333ea;
  --color-purple-700: #7e22ce;

  /* Amber Extended */
  --color-amber-700: #b45309;
}
```

**Color Usage**:

- **Sky** (Primary): Buttons, links, sales KPI
- **Green**: Success states, orders KPI
- **Purple**: Customers KPI, additional features
- **Amber**: Warnings, pending status
- **Red**: Errors, cancelled status
- **Slate**: Neutral text, borders

---

## 📱 Responsive Design

### Sidebar

- Desktop: Always visible (`w-64`)
- Mobile: Toggleable with hamburger button
- Smooth transitions (`transition-all duration-300`)

### Grid Layouts

- KPI Cards: `grid-cols-1 md:grid-cols-3`
- Dashboard Sections: `grid-cols-1 lg:grid-cols-3`

### Modal

- Size prop: `sm`, `md`, `lg`, `xl`
- Max height: `max-h-[90vh]`
- Responsive padding and spacing

---

## 🔌 API Integration

### Dashboard Service

**Endpoints Used**:

1. **Get KPIs** (Orders & Customers Count):

```typescript
getCounts(): Observable<Kpis> {
  // GET /api/orders?pageNumber=1&pageSize=1
  // GET /api/customers?pageNumber=1&pageSize=1
  return forkJoin({ orders, customers }).pipe(
    map(res => ({
      totalSales: 0, // Needs dedicated endpoint
      ordersCount: res.orders?.data?.totalCount || 0,
      customersCount: res.customers?.data?.totalCount || 0
    }))
  );
}
```

2. **Get Recent Orders**:

```typescript
getRecentOrders(): Observable<RecentOrder[]> {
  // GET /api/orders?pageNumber=1&pageSize=5
  return this.http.get<any>(url).pipe(
    map(res => {
      const items = res?.data?.items ?? [];
      return items.map(it => ({
        id: it.orderId ?? it.id,
        customer: it.customerName ?? 'N/A',
        total: it.totalAmount ?? '$0',
        status: it.status ?? 'Unknown'
      }));
    })
  );
}
```

3. **Get Order Detail** (In Modal):

```typescript
// GET /api/orders/{orderId}
loadOrderDetail(): void {
  this.http.get<any>(url).subscribe({
    next: (response) => {
      const data = response?.data || response;
      this.orderDetail = { ... };
    }
  });
}
```

---

## 🚀 Usage Examples

### 1. Using Main Layout in Other Features

```typescript
// products/products.component.ts
import { MainLayoutComponent } from '../../shared/components/layout/main-layout.component';

@Component({
  imports: [CommonModule, MainLayoutComponent],
  template: `
    <app-main-layout>
      <div class="p-6">
        <h1>Products Page</h1>
        <!-- Your content -->
      </div>
    </app-main-layout>
  `,
})
export class ProductsComponent {}
```

### 2. Creating Similar Modal Components

```typescript
// Follow the pattern from OrderDetailModalComponent
@Component({
  selector: 'app-product-detail-modal',
  imports: [CommonModule, ModalComponent],
  template: `
    <app-modal [open]="open" [title]="'Product Details'" [size]="'lg'" (closed)="handleClose()">
      <!-- Your content -->
    </app-modal>
  `,
})
export class ProductDetailModalComponent {
  @Input() open = false;
  @Input() productId: number | null = null;
  @Output() closed = new EventEmitter<void>();
}
```

### 3. Adding Interactive KPI Cards

```typescript
// In component
showKpiDetail(type: string): void {
  switch(type) {
    case 'sales':
      this.openSalesDetailModal();
      break;
    case 'orders':
      this.router.navigate(['/orders']);
      break;
    case 'customers':
      this.router.navigate(['/customers']);
      break;
  }
}
```

---

## 📊 Before vs After Comparison

| Feature            | Before                         | After                        |
| ------------------ | ------------------------------ | ---------------------------- |
| **Layout**         | Inline sidebar/topbar per page | Reusable MainLayoutComponent |
| **Order Details**  | Navigate to new page           | Modal popup                  |
| **KPI Cards**      | Plain white cards              | Gradient cards with icons    |
| **Interactions**   | Static text                    | Hover effects, clickable     |
| **Loading States** | None                           | Spinners and skeletons       |
| **Empty States**   | None                           | Emoji + helpful messages     |
| **Animations**     | None                           | Fade in, slide, hover lifts  |
| **Status Display** | Plain text                     | Color-coded badges           |
| **Quick Actions**  | Text links                     | Interactive cards            |

---

## 🔮 Future Enhancements

### Phase 1 (High Priority)

- [ ] Implement detailed sales modal on KPI card click
- [ ] Add filters and date range picker for dashboard data
- [ ] Real-time data updates with WebSocket
- [ ] Print receipt functionality in order modal

### Phase 2 (Medium Priority)

- [ ] Charts and graphs for sales trends (Chart.js/ApexCharts)
- [ ] Notification panel with real-time alerts
- [ ] Quick order creation modal from dashboard
- [ ] Recent activity timeline

### Phase 3 (Nice to Have)

- [ ] Drag-and-drop dashboard customization
- [ ] Multiple dashboard views (Admin, Manager, Cashier)
- [ ] Export dashboard data to PDF/Excel
- [ ] Dark mode support

---

## 🛠️ Development Notes

### File Structure

```
src/app/
├── shared/
│   └── components/
│       ├── layout/
│       │   └── main-layout.component.ts ✨ NEW
│       └── modal/
│           └── modal.component.ts ✅ EXISTING
├── features/
│   └── dashboard/
│       ├── components/
│       │   └── order-detail-modal.component.ts ✨ NEW
│       ├── dashboard.component.ts ♻️ REFACTORED
│       └── dashboard.service.ts ✅ EXISTING
└── styles.scss ♻️ ENHANCED
```

### Dependencies

- **Angular 20** (Standalone Components)
- **Tailwind CSS v4** (Custom theme in styles.scss)
- **RxJS** (Observable patterns)
- **HttpClient** (API calls)

### Testing Checklist

- [x] Dashboard loads KPI data correctly
- [x] Recent orders table displays correctly
- [x] Modal opens when clicking "View Details"
- [x] Modal fetches and displays order details
- [x] Modal closes properly
- [x] Sidebar toggle works
- [x] Responsive design on mobile/tablet
- [x] Hover effects work smoothly
- [x] No console errors
- [x] No linter errors

---

## 📝 Notes for Team

1. **Reuse MainLayoutComponent**: Use this for all future feature pages to maintain consistency
2. **Follow Modal Pattern**: Create similar modal components for other entities (products, customers, etc.)
3. **Color Consistency**: Use the defined color palette from `@theme` in styles.scss
4. **API Flexibility**: The service layer handles multiple backend response formats
5. **Accessibility**: Add proper ARIA labels for screen readers (future enhancement)

---

## 🤝 Contributing

When adding new features to dashboard:

1. **Keep it modal-based**: Avoid unnecessary page navigations
2. **Use animations**: Apply the custom animation classes
3. **Follow color scheme**: Use gradient cards for visual hierarchy
4. **Add loading states**: Always show spinners during API calls
5. **Handle errors gracefully**: Show user-friendly error messages

---

**Last Updated**: November 26, 2025
**Author**: AI Assistant
**Version**: 2.0 (SPA Refactor)
