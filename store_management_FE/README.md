# Store Management Frontend

## 📋 Tổng Quan

Frontend cho hệ thống quản lý cửa hàng, được xây dựng với Angular 20 và Tailwind CSS.

### Technology Stack

- **Framework**: Angular 20.3.4 (Standalone Components)
- **Styling**: Tailwind CSS 4.x
- **HTTP Client**: Angular HttpClient
- **Routing**: Angular Router (Lazy Loading)
- **State**: Service-based với BehaviorSubject

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
ng serve

# Build for production
ng build
```

Mở trình duyệt tại `http://localhost:4200/`

### Tailwind/PostCSS Setup

Tailwind CSS 4 yêu cầu PostCSS load plugin chính thức. Nếu bạn vừa clone dự án hoặc bị mất hiệu ứng CSS (ví dụ `http://localhost:4200/dashboard` chỉ hiển thị HTML thô), hãy đảm bảo file `postcss.config.cjs` tồn tại với nội dung:

```
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

Angular CLI sẽ tự động phát hiện cấu hình này và biên dịch các lớp tiện ích từ `src/styles.scss`.

---

## ✅ TÍNH NĂNG ĐÃ TRIỂN KHAI

| Feature                     | Trạng thái | Mô tả                                              |
| --------------------------- | ---------- | -------------------------------------------------- |
| Project Setup               | ✅         | Angular 20, Tailwind CSS, Routing                  |
| Authentication              | ✅         | Login form, AuthService, JWT handling              |
| Auth Guard                  | ✅         | Route protection                                   |
| Auth Interceptor            | ✅         | Auto attach JWT token                              |
| **Dashboard (SPA)**         | ✅ **NEW** | **Modal-based, MainLayout, Animations**            |
| Dashboard Service           | ✅         | Load KPIs, Recent Orders                           |
| Lazy Loading                | ✅         | Module-based lazy loading                          |
| Environment Config          | ✅         | API URL configuration                              |
| Shared DataTable Component  | ✅         | Table với pagination, sorting, row actions         |
| Modal & Confirm Dialog      | ✅         | Reusable modal primitives                          |
| Toast & Notification System | ✅         | Toast service + container trong root component     |
| Loading/Search Utilities    | ✅         | Loading spinner & debounced search input           |
| Base API Service & Typings  | ✅         | Common HTTP helper + ApiResponse/PagedResult types |
| **Main Layout Component**   | ✅ **NEW** | **Reusable sidebar + topbar layout**               |
| **Order Detail Modal**      | ✅ **NEW** | **View order details in modal popup**              |
 | **Material Icons**          | ✅ **NEW** | **Angular Material Icons integration**             |
| **Icon Component**          | ✅ **NEW** | **Reusable icon component**                        |

---

## 🚧 TÍNH NĂNG CẦN TRIỂN KHAI

### ✅ Phase 1: Core Infrastructure (Hoàn thành)

- 🆕 `app/shared/components/data-table` với pagination, sorting, action buttons
- 🆕 `app/shared/components/pagination`, `search-input`, `loading-spinner`
- 🆕 `app/shared/components/modal`, `confirm-dialog` cho dialog workflows
- 🆕 `app/shared/components/toast` + `ToastService` (mount trong `app-root`)
- 🆕 `app/shared/directives/has-role` cho role-based UI
- 🆕 `app/types/*` + `app/apis/base-api.service.ts` cho typings & HTTP helpers
- ♻️ `app/app.ts` render toast container toàn cục

> ✅ Phase 1 hoàn thành ngày 25/11/2025 – FE sẵn sàng bước sang Phase 2.

### ✅ Phase 1.5: Dashboard SPA Refactor (Hoàn thành)

- 🆕 `app/shared/components/layout/main-layout.component.ts` - Reusable layout với sidebar + topbar
- 🆕 `app/features/dashboard/components/order-detail-modal.component.ts` - Modal xem chi tiết order
- ♻️ `app/features/dashboard/dashboard.component.ts` - Refactor với modal interactions
- ♻️ `src/styles.scss` - Thêm animations, custom scrollbar, purple color palette
- 📝 `DASHBOARD_REFACTOR.md` - Chi tiết documentation về SPA refactor

**Key Changes**:

- ✨ **SPA Design**: Modal popups thay vì page navigation
- ✨ **Modern UI**: Gradient KPI cards, hover effects, animations
- ✨ **Reusable Layout**: MainLayoutComponent có thể dùng cho mọi feature
- ✨ **Better UX**: Loading states, empty states, smooth transitions

> ✅ Phase 1.5 hoàn thành ngày 26/11/2025 – Dashboard hiện đại, theo pattern SPA. Xem chi tiết tại [DASHBOARD_REFACTOR.md](./DASHBOARD_REFACTOR.md)

### ✅ Phase 1.6: Material Icons Integration (Hoàn thành)

- 🆕 `src/app/shared/components/icon/icon.component.ts` - Reusable icon component
- ♻️ `src/index.html` - Thêm Material Icons fonts
- ♻️ All components - Thay emojis bằng Material Icons
- 📝 `MATERIAL_ICONS_GUIDE.md` - Hướng dẫn sử dụng Material Icons

**Key Changes**:

- ✨ **Professional Icons**: Thay emojis bằng Material Icons chuyên nghiệp
- ✨ **Reusable Component**: Icon component có thể dùng everywhere
- ✨ **Consistent Design**: Unified icon system across the app
- ✨ **Easy to Use**: Simple API với size và style options

> ✅ Phase 1.6 hoàn thành ngày 26/11/2025 – Material Icons đã tích hợp. Xem chi tiết tại [MATERIAL_ICONS_GUIDE.md](./MATERIAL_ICONS_GUIDE.md)

### Phase 2: Product Management

| Task                | Mô tả                               | Ưu tiên   |
| ------------------- | ----------------------------------- | --------- |
| Product List        | List với pagination, search, filter | 🔴 High   |
| Product Detail      | View chi tiết sản phẩm              | 🔴 High   |
| Product Form        | Create/Edit form                    | 🔴 High   |
| Category Management | CRUD categories                     | 🟡 Medium |

### Phase 3: Customer & Supplier

| Task             | Mô tả                | Ưu tiên   |
| ---------------- | -------------------- | --------- |
| Customer List    | List với search      | 🔴 High   |
| Customer Form    | Create/Edit form     | 🔴 High   |
| Customer History | Lịch sử mua hàng     | 🟡 Medium |
| Supplier CRUD    | Quản lý nhà cung cấp | 🟢 Low    |

### Phase 4: Order Management

| Task            | Mô tả                     | Ưu tiên   |
| --------------- | ------------------------- | --------- |
| Order List      | List với filter by status | 🔴 High   |
| Order Create    | Tạo đơn hàng mới (POS)    | 🔴 High   |
| Order Detail    | View order + items        | 🔴 High   |
| Checkout Flow   | Thanh toán                | 🔴 High   |
| Apply Promotion | Áp dụng khuyến mãi        | 🟡 Medium |

### Phase 5: Inventory & Purchase

| Task             | Mô tả                  | Ưu tiên   |
| ---------------- | ---------------------- | --------- |
| Inventory List   | Danh sách tồn kho      | 🔴 High   |
| Low Stock Alert  | Cảnh báo hàng sắp hết  | 🔴 High   |
| Inventory Adjust | Điều chỉnh kho (Admin) | 🟡 Medium |
| Purchase Create  | Tạo đơn nhập hàng      | 🟡 Medium |
| Purchase Confirm | Xác nhận nhập kho      | 🟡 Medium |

### Phase 6: Promotions & Reports

| Task             | Mô tả              | Ưu tiên   |
| ---------------- | ------------------ | --------- |
| Promotion CRUD   | Quản lý khuyến mãi | 🟡 Medium |
| Sales Report     | Báo cáo doanh thu  | 🟡 Medium |
| Inventory Report | Báo cáo tồn kho    | 🟢 Low    |
| Charts           | Biểu đồ analytics  | 🟢 Low    |

### Phase 7: User Management

| Task             | Mô tả                 | Ưu tiên |
| ---------------- | --------------------- | ------- |
| User CRUD        | Quản lý users (Admin) | 🟢 Low  |
| Profile Settings | Đổi thông tin cá nhân | 🟢 Low  |
| Change Password  | Đổi mật khẩu          | 🟢 Low  |

---

## 📁 Cấu Trúc Dự Án Đề Xuất

```
src/app/
├── apis/                          # API services
│   ├── base-api.service.ts
│   ├── product.api.ts
│   ├── order.api.ts
│   ├── customer.api.ts
│   ├── inventory.api.ts
│   ├── promotion.api.ts
│   ├── purchase.api.ts
│   └── report.api.ts
│
├── core/                          # Core services & guards
│   ├── auth.guard.ts
│   ├── admin.guard.ts
│   ├── auth.interceptor.ts
│   ├── config.service.ts
│   └── env.service.ts
│
├── features/                      # Feature modules
│   ├── auth/
│   │   ├── login/
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   │
│   ├── dashboard/
│   │   ├── components/
│   │   │   └── order-detail-modal.component.ts    ✨ NEW
│   │   ├── dashboard.component.ts                 ♻️ REFACTORED
│   │   └── dashboard.service.ts
│   │
│   ├── products/
│   │   ├── product-list.component.ts
│   │   ├── product-form.component.ts
│   │   └── products.module.ts
│   │
│   ├── orders/
│   │   ├── order-list.component.ts
│   │   ├── order-create.component.ts
│   │   ├── order-detail.component.ts
│   │   └── orders.module.ts
│   │
│   ├── customers/
│   ├── inventory/
│   ├── promotions/
│   ├── purchases/
│   ├── suppliers/
│   ├── categories/
│   ├── users/
│   └── reports/
│
├── shared/                        # Shared components
│   ├── components/
│   │   ├── layout/
│   │   │   └── main-layout.component.ts          ✨ NEW
│   │   ├── icon/
│   │   │   └── icon.component.ts                 ✨ NEW
│   │   ├── data-table/
│   │   ├── modal/
│   │   ├── confirm-dialog/
│   │   ├── toast/
│   │   ├── loading-spinner/
│   │   ├── pagination/
│   │   └── search-input/
│   ├── pipes/
│   │   ├── currency.pipe.ts
│   │   └── date-format.pipe.ts
│   └── directives/
│       └── has-role.directive.ts
│
├── types/                         # TypeScript interfaces
│   ├── api-response.ts
│   ├── pagination.ts
│   ├── product.ts
│   ├── order.ts
│   ├── customer.ts
│   └── ...
│
├── app.routes.ts
├── app.config.ts
└── app.ts
```

---

## 🔌 API Integration

### Backend API Base URL

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api',
};
```

### Available API Endpoints

```
POST   /api/auth/login           - Đăng nhập
POST   /api/auth/refresh         - Refresh token
POST   /api/auth/logout          - Đăng xuất

GET    /api/products             - Danh sách sản phẩm (paginated)
GET    /api/products/{id}        - Chi tiết sản phẩm
POST   /api/products             - Tạo sản phẩm
PUT    /api/products/{id}        - Cập nhật sản phẩm
DELETE /api/products/{id}        - Xóa sản phẩm

GET    /api/orders               - Danh sách đơn hàng
GET    /api/orders/{id}          - Chi tiết đơn hàng
POST   /api/orders               - Tạo đơn hàng
POST   /api/orders/{id}/items    - Thêm sản phẩm
POST   /api/orders/{id}/checkout - Thanh toán

GET    /api/customers            - Danh sách khách hàng
GET    /api/inventory            - Danh sách tồn kho
GET    /api/inventory/low-stock  - Hàng sắp hết
GET    /api/promotion            - Danh sách khuyến mãi
GET    /api/reports/*            - Các báo cáo
```

### API Response Format

```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  error: string | null;
  timestamp: string;
}

interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
```

---

## 🎨 UI/UX Guidelines

### Color Palette (Tailwind v4)

```
Primary:   sky-600 (#0284c7)      - Buttons, links, primary actions
Secondary: slate-600 (#475569)    - Text, borders, neutral elements
Success:   green-600 (#16a34a)    - Success states, completed
Danger:    red-600 (#dc2626)      - Errors, delete actions
Warning:   amber-500 (#f59e0b)    - Warnings, pending states
Purple:    purple-600 (#9333ea)   - Additional features (NEW)
```

**Gradient KPI Cards**:

- Sales: `bg-gradient-to-br from-sky-500 to-sky-600`
- Orders: `bg-gradient-to-br from-green-500 to-green-600`
- Customers: `bg-gradient-to-br from-purple-500 to-purple-600`

### Layout Standards

- Sidebar width: `w-64` (256px)
- Content padding: `p-6` (24px)
- Card: `bg-white rounded-xl shadow-sm border border-slate-200 p-6`
- Button primary: `bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition-all`
- Hover effects: `hover:shadow-xl hover:-translate-y-1 transition-all duration-300`

### Animations (Custom)

- `animate-fade-in` - Fade in với slight upward movement
- `animate-slide-in-right` - Slide in from right
- `animate-pulse-slow` - Slow pulsing for notifications
- Smooth scrollbar styling
- Global transitions cho interactive elements

---

## 📅 Development Timeline

| Tuần | Nội dung                                      | Status  |
| ---- | --------------------------------------------- | ------- |
| 1    | Core Infrastructure (Shared components, APIs) | ✅ DONE |
| 2    | Products + Categories                         | 🔴 TODO |
| 3    | Customers + Suppliers                         | 🔴 TODO |
| 4    | Orders (Full workflow)                        | 🔴 TODO |
| 5    | Inventory + Purchases                         | 🔴 TODO |
| 6    | Promotions + Reports                          | 🔴 TODO |
| 7    | Users + Settings                              | 🔴 TODO |
| 8    | Testing + Polish                              | 🔴 TODO |

---

## 🔧 Development

### Code Generation

```bash
# Generate component
ng generate component features/products/product-form --standalone

# Generate service
ng generate service apis/product

# Generate module
ng generate module features/inventory --routing
```

### Linting & Formatting

```bash
# Lint
ng lint

# Format (if prettier configured)
npm run format
```

### Testing

```bash
# Unit tests
ng test

# E2E tests
ng e2e
```

---

## 📝 Notes

- Backend API đã hoàn thiện 100%, sẵn sàng cho FE integration
- Sử dụng JWT authentication với auto-refresh
- CORS đã được cấu hình cho `http://localhost:4200`
- Pagination, sorting, filtering được hỗ trợ ở tất cả list endpoints
- **Dashboard sử dụng SPA pattern với modal interactions** ✨
- **MainLayoutComponent có thể reuse cho tất cả features** ✨
- **Material Icons thay thế emojis cho UI chuyên nghiệp** ✨

## 🎯 SPA Design Pattern

Dashboard đã được refactor theo hướng **Single Page Application**:

1. **Modal-Based Interactions**: Click "View Details" mở modal thay vì navigate
2. **Reusable Layout**: MainLayoutComponent với sidebar + topbar
3. **Modern Animations**: Gradient cards, hover effects, smooth transitions
4. **Better UX**: Loading states, empty states, error handling
5. **Material Icons**: Professional icon system thay thế emojis

Chi tiết xem tại:

- [DASHBOARD_REFACTOR.md](./DASHBOARD_REFACTOR.md) - SPA architecture
- [MATERIAL_ICONS_GUIDE.md](./MATERIAL_ICONS_GUIDE.md) - Icon usage guide
- [QUICK_START_SPA.md](./QUICK_START_SPA.md) - Quick reference

---

**Happy Coding! 🚀**
