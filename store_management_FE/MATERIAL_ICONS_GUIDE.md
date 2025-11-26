# 🎨 Material Icons Integration Guide

## Tổng Quan

Project đã được tích hợp **Angular Material Icons** để thay thế emojis và tạo giao diện chuyên nghiệp hơn.

### ✨ Những Gì Đã Thay Đổi

| Trước                        | Sau                                                       |
| ---------------------------- | --------------------------------------------------------- |
| ❌ Emojis (📊, 📦, 🛒, etc.) | ✅ Material Icons (dashboard, inventory_2, shopping_cart) |
| ❌ SVG inline phức tạp       | ✅ Reusable Icon Component                                |
| ❌ Inconsistent sizing       | ✅ Consistent icon system                                 |

---

## 🚀 Setup

### 1. Dependencies

```bash
npm install @angular/material @angular/cdk
```

### 2. Fonts Added to `index.html`

```html
<!-- Material Icons -->
<link
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
  rel="stylesheet"
/>
<link href="https://fonts.googleapis.com/css2?family=Material+Icons" rel="stylesheet" />
```

---

## 📦 Icon Component

### File: `src/app/shared/components/icon/icon.component.ts`

Reusable component để hiển thị Material Icons với các options:

**Props**:

- `name`: Icon name (e.g., "dashboard", "shopping_cart")
- `size`: Size in pixels (default: 24)
- `style`: Icon style - "outlined" | "filled" | "rounded" | "sharp" | "two-tone"
- `customClass`: Additional CSS classes

**Usage**:

```typescript
import { IconComponent } from './shared/components/icon/icon.component';

@Component({
  imports: [IconComponent],
  template: `
    <!-- Basic usage -->
    <app-icon name="dashboard" [size]="24"></app-icon>

    <!-- With custom class -->
    <app-icon name="notifications" [size]="20" customClass="text-red-600"></app-icon>

    <!-- Filled style -->
    <app-icon name="favorite" [size]="24" style="filled" customClass="text-red-500"></app-icon>
  `
})
```

---

## 🎯 Icon Mapping

### Navigation Icons

| Feature    | Old Emoji | New Icon      | Icon Name       |
| ---------- | --------- | ------------- | --------------- |
| Dashboard  | 📊        | dashboard     | `dashboard`     |
| Products   | 📦        | inventory_2   | `inventory_2`   |
| Orders     | 🛒        | shopping_cart | `shopping_cart` |
| Customers  | 👥        | people        | `people`        |
| Inventory  | 📋        | warehouse     | `warehouse`     |
| Promotions | 🎁        | local_offer   | `local_offer`   |

### KPI Card Icons

| KPI          | Old Emoji | New Icon     | Icon Name      |
| ------------ | --------- | ------------ | -------------- |
| Total Sales  | 💵 (SVG)  | payments     | `payments`     |
| Total Orders | 🛍️ (SVG)  | shopping_bag | `shopping_bag` |
| Customers    | 👥 (SVG)  | groups       | `groups`       |

### Quick Action Icons

| Action     | Old Emoji | New Icon     | Icon Name      |
| ---------- | --------- | ------------ | -------------- |
| Products   | 📦        | inventory_2  | `inventory_2`  |
| Orders     | 🛒        | receipt_long | `receipt_long` |
| Customers  | 👥        | people       | `people`       |
| Promotions | 🎁        | local_offer  | `local_offer`  |

### UI Action Icons

| Action        | Old      | New Icon      | Icon Name       |
| ------------- | -------- | ------------- | --------------- |
| Menu Toggle   | ☰ (SVG)  | menu          | `menu`          |
| Notifications | 🔔 (SVG) | notifications | `notifications` |
| Logout        | → (SVG)  | logout        | `logout`        |
| View All      | → (SVG)  | arrow_forward | `arrow_forward` |
| Close         | ✕        | close         | `close`         |
| Print         | 🖨️       | print         | `print`         |
| Refresh       | 🔄       | refresh       | `refresh`       |
| Error         | ⚠️       | error         | `error`         |
| Empty State   | 📦       | inbox         | `inbox`         |

---

## 📚 Common Material Icons

### General

```
home, dashboard, settings, search, filter_list, more_vert, more_horiz
menu, close, arrow_back, arrow_forward, expand_more, expand_less
star, star_outline, favorite, favorite_border
```

### E-commerce

```
shopping_cart, shopping_bag, add_shopping_cart, remove_shopping_cart
inventory, inventory_2, warehouse, store, storefront
local_offer, sell, discount, loyalty, card_giftcard
receipt, receipt_long, payments, payment, credit_card
```

### People & Communication

```
people, person, group, groups, account_circle
email, phone, chat, comment, message, forum
notifications, notification_important, notifications_active
```

### Actions

```
add, remove, edit, delete, save, cancel
check, check_circle, done, done_all
close, clear, block, lock, lock_open
refresh, sync, update, download, upload
```

### Status

```
error, warning, info, check_circle, cancel
pending, schedule, watch_later, timer
visibility, visibility_off, verified, new_releases
```

---

## 💡 Usage Examples

### 1. Navigation Menu

```typescript
// main-layout.component.ts
navItems: NavItem[] = [
  { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
  { label: 'Products', route: '/products', icon: 'inventory_2' },
  { label: 'Orders', route: '/orders', icon: 'shopping_cart' },
];

// Template
<a *ngFor="let item of navItems" [routerLink]="item.route">
  <app-icon [name]="item.icon" [size]="24"></app-icon>
  <span>{{ item.label }}</span>
</a>
```

### 2. KPI Cards

```html
<div class="bg-gradient-to-br from-sky-500 to-sky-600 text-white p-6 rounded-xl">
  <div class="flex items-start justify-between">
    <div>
      <div class="text-sky-100 text-sm">Total Sales</div>
      <div class="text-3xl font-bold">${{ sales }}</div>
    </div>
    <div class="bg-white/20 p-3 rounded-lg">
      <app-icon name="payments" [size]="32" customClass="text-white"></app-icon>
    </div>
  </div>
</div>
```

### 3. Action Buttons

```html
<!-- Primary button -->
<button class="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg">
  <app-icon name="add" [size]="20" customClass="text-white"></app-icon>
  Add New
</button>

<!-- Icon button -->
<button class="p-2 rounded-lg hover:bg-slate-100">
  <app-icon name="more_vert" [size]="24"></app-icon>
</button>

<!-- Delete button -->
<button class="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg">
  <app-icon name="delete" [size]="20" customClass="text-white"></app-icon>
  Delete
</button>
```

### 4. Status Badges

```html
<div class="flex items-center gap-2">
  <app-icon name="check_circle" [size]="16" customClass="text-green-600"></app-icon>
  <span class="text-green-700">Completed</span>
</div>

<div class="flex items-center gap-2">
  <app-icon name="pending" [size]="16" customClass="text-amber-600"></app-icon>
  <span class="text-amber-700">Pending</span>
</div>

<div class="flex items-center gap-2">
  <app-icon name="cancel" [size]="16" customClass="text-red-600"></app-icon>
  <span class="text-red-700">Cancelled</span>
</div>
```

### 5. Empty States

```html
<div class="text-center py-12">
  <app-icon name="inbox" [size]="64" customClass="text-slate-400 mb-3"></app-icon>
  <div class="text-slate-600 font-medium">No items yet</div>
  <div class="text-slate-500 text-sm">Items will appear here</div>
</div>
```

### 6. Loading & Error States

```html
<!-- Error State -->
<div class="text-center py-8">
  <app-icon name="error" [size]="64" customClass="text-red-600 mb-2"></app-icon>
  <div class="text-red-600 text-lg">Error Loading Data</div>
  <button class="mt-4 flex items-center gap-2 mx-auto">
    <app-icon name="refresh" [size]="20"></app-icon>
    Retry
  </button>
</div>

<!-- Success State -->
<div class="flex items-center gap-2 text-green-700">
  <app-icon name="check_circle" [size]="20" customClass="text-green-600"></app-icon>
  Successfully saved!
</div>
```

---

## 🎨 Styling Tips

### 1. Icon Colors

Icons inherit text color by default. Use `customClass` or parent color classes:

```html
<!-- Inherit from parent -->
<div class="text-sky-600">
  <app-icon name="dashboard" [size]="24"></app-icon>
</div>

<!-- Custom class -->
<app-icon name="star" [size]="24" customClass="text-amber-500"></app-icon>
```

### 2. Icon Sizing

Common sizes:

- **16px**: Small inline icons
- **20px**: Button icons
- **24px**: Default icons, navigation
- **32px**: KPI cards, large icons
- **48-64px**: Empty states, hero icons

```html
<app-icon name="info" [size]="16"></app-icon>
<!-- Small -->
<app-icon name="search" [size]="20"></app-icon>
<!-- Button -->
<app-icon name="dashboard" [size]="24"></app-icon>
<!-- Default -->
<app-icon name="payments" [size]="32"></app-icon>
<!-- Large -->
<app-icon name="inbox" [size]="64"></app-icon>
<!-- Extra large -->
```

### 3. Icon Styles

```typescript
// Outlined (default) - Light, modern
<app-icon name="favorite" style="outlined"></app-icon>

// Filled - Solid, bold
<app-icon name="favorite" style="filled"></app-icon>

// Rounded - Soft corners
<app-icon name="favorite" style="rounded"></app-icon>

// Sharp - Angular, sharp corners
<app-icon name="favorite" style="sharp"></app-icon>
```

### 4. Hover Effects

```html
<!-- Icon color change on hover -->
<button class="group">
  <app-icon
    name="edit"
    [size]="20"
    customClass="text-slate-600 group-hover:text-sky-600"
  ></app-icon>
</button>

<!-- Icon with background -->
<div class="bg-sky-100 group-hover:bg-sky-600 transition-colors">
  <app-icon name="add" [size]="24" customClass="text-sky-600 group-hover:text-white"></app-icon>
</div>
```

---

## 🔍 Finding Icons

### Official Resources

1. **Google Fonts Icons**: https://fonts.google.com/icons
2. **Material Symbols**: https://fonts.google.com/icons?icon.set=Material+Symbols
3. **Material Icons**: https://fonts.google.com/icons?icon.set=Material+Icons

### Search Tips

- Search by function (e.g., "shopping", "payment", "user")
- Filter by style (Outlined, Filled, Rounded, Sharp)
- Check variants (e.g., `star` vs `star_outline` vs `star_border`)

---

## ✅ Best Practices

### 1. Consistency

```typescript
// ✅ Good - Use same icon family
<app-icon name="add"></app-icon>
<app-icon name="edit"></app-icon>
<app-icon name="delete"></app-icon>

// ❌ Bad - Mix emojis and icons
<span>➕</span>
<app-icon name="edit"></app-icon>
<span>🗑️</span>
```

### 2. Size Appropriateness

```html
<!-- ✅ Good - Appropriate sizes -->
<button class="text-sm"><app-icon name="add" [size]="16"></app-icon> Add</button>

<!-- ❌ Bad - Icon too large for button -->
<button class="text-sm"><app-icon name="add" [size]="32"></app-icon> Add</button>
```

### 3. Semantic Meaning

```html
<!-- ✅ Good - Icon matches action -->
<button><app-icon name="delete"></app-icon> Delete</button>

<!-- ❌ Bad - Icon doesn't match -->
<button><app-icon name="favorite"></app-icon> Delete</button>
```

### 4. Accessibility

```html
<!-- ✅ Good - Aria label provided -->
<app-icon name="close" [size]="24" [attr.aria-label]="'Close modal'"></app-icon>

<!-- ✅ Good - Text alternative -->
<button>
  <app-icon name="save" [size]="20"></app-icon>
  <span>Save</span>
</button>
```

---

## 🚀 Migration Checklist

When adding Material Icons to new components:

- [ ] Import `IconComponent`
- [ ] Replace emojis with icon names
- [ ] Replace SVG with `<app-icon>`
- [ ] Set appropriate sizes
- [ ] Add custom classes for colors
- [ ] Test hover states
- [ ] Verify responsive behavior
- [ ] Check contrast ratios

---

## 📝 Quick Reference

### Most Used Icons in This Project

```typescript
// Navigation
dashboard, inventory_2, shopping_cart, people, warehouse, local_offer

// Actions
add, edit, delete, save, close, refresh, print, search, filter_list

// Status
check_circle, error, warning, pending, done

// UI
menu, more_vert, arrow_forward, arrow_back, expand_more, notifications

// Commerce
shopping_bag, payments, receipt_long, store, sell, inventory
```

---

**Need more icons?** Browse the full collection at [Google Fonts Icons](https://fonts.google.com/icons)

**Happy Coding! 🚀**
