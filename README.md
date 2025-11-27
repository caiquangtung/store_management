# 🏪 Store Management Platform

<p align="center">
  <strong>Full-stack store management system: .NET 9 API + Angular 20 SPA + MySQL</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/.NET-9.0-512BD4?style=flat&logo=dotnet" alt=".NET 9" />
  <img src="https://img.shields.io/badge/Angular-20-DD0031?style=flat&logo=angular" alt="Angular 20" />
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat&logo=mysql&logoColor=white" alt="MySQL 8" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=flat&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat" alt="License" />
</p>

---

## 📋 Mục Lục

- [Tổng Quan](#tong-quan)
- [Tính Năng](#tinh-nang)
- [Kiến Trúc](#kien-truc)
- [Tech Stack](#tech-stack)
- [Cấu Trúc Dự Án](#cau-truc-du-an)
- [Yêu Cầu Hệ Thống](#yeu-cau-he-thong)
- [Cài Đặt & Khởi Chạy](#cai-dat--khoi-chay)
- [Cấu Hình](#cau-hinh)
- [API Endpoints](#api-endpoints)
- [Database](#database)
- [Scripts Thường Dùng](#scripts-thuong-dung)
- [Testing & Quality](#testing--quality)
- [Tài Khoản Mặc Định](#tai-khoan-mac-dinh)
- [Screenshots](#screenshots)
- [Tài Liệu](#tai-lieu)
- [Đóng Góp](#dong-gop)
- [License](#license)

---

<a id="tong-quan"></a>

## 🎯 Tổng Quan

**Store Management Platform** là hệ thống quản lý cửa hàng full-stack hiện đại, được thiết kế với kiến trúc Clean Architecture cho backend và Single Page Application (SPA) pattern cho frontend.

### Mục Tiêu Dự Án

- ✅ Quản lý toàn diện hoạt động kinh doanh cửa hàng
- ✅ Giao diện người dùng hiện đại, responsive
- ✅ API RESTful với xác thực JWT
- ✅ Hệ thống phân quyền linh hoạt (Admin/Staff)
- ✅ Báo cáo và phân tích dữ liệu

---

<a id="tinh-nang"></a>

## ✨ Tính Năng

### 🔐 Authentication & Authorization

- Đăng nhập/Đăng xuất với JWT Token
- Refresh Token tự động
- Phân quyền Role-based (Admin/Staff)

### 👥 Quản Lý Người Dùng

- CRUD users (Admin only)
- Quản lý thông tin nhân viên
- Đổi mật khẩu

### 🛍️ Quản Lý Sản Phẩm

- CRUD sản phẩm với hình ảnh
- Phân loại theo danh mục
- Quản lý giá bán

### 📦 Quản Lý Tồn Kho

- Theo dõi số lượng tồn
- Cảnh báo hàng sắp hết (Low Stock)
- Điều chỉnh kho (Adjustments)
- Lịch sử xuất nhập kho

### 🛒 Quản Lý Đơn Hàng

- Tạo đơn hàng (POS workflow)
- Thêm/Sửa/Xóa sản phẩm trong đơn
- Áp dụng khuyến mãi
- Thanh toán (Cash/Card/Bank Transfer)
- Theo dõi trạng thái đơn hàng

### 🎁 Quản Lý Khuyến Mãi

- Tạo mã giảm giá (Percentage/Fixed)
- Thiết lập thời gian hiệu lực
- Validate và áp dụng tự động

### 📥 Quản Lý Nhập Hàng

- Tạo đơn nhập hàng từ nhà cung cấp
- Xác nhận nhập kho (auto update inventory)
- Theo dõi lịch sử nhập hàng

### 📊 Báo Cáo & Thống Kê

- Tổng quan doanh thu (ngày/tuần/tháng)
- Báo cáo sản phẩm bán chạy/dead stock
- Sổ kho chi tiết (Inventory Ledger)
- Tổng hợp nhập hàng

---

<a id="kien-truc"></a>

## 🏗️ Kiến Trúc

### Backend - Clean Architecture (4-Layer)

```
┌─────────────────────────────────────────────────────────────┐
│                    StoreManagement.API                      │
│                  (Presentation Layer)                       │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Controllers │ Middleware │ Authorization │ Config   │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                StoreManagement.Application                  │
│                (Business Logic Layer)                       │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Services │ DTOs │ Validators │ Mappings │ Common    │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│               StoreManagement.Infrastructure                │
│                 (Data Access Layer)                         │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ DbContext │ Repositories │ Services │ Migrations    │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  StoreManagement.Domain                     │
│                    (Core Layer)                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Entities │ Enums │ Interfaces │ (No Dependencies)   │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Frontend - Angular SPA Pattern

```
src/app/
├── apis/              # API services (HTTP clients)
├── core/              # Guards, Interceptors, Core services
├── features/          # Feature modules (lazy-loaded)
│   ├── auth/          # Authentication
│   ├── dashboard/     # Dashboard với KPIs
│   ├── products/      # Quản lý sản phẩm
│   ├── orders/        # Quản lý đơn hàng
│   └── ...
├── shared/            # Reusable components, pipes, directives
│   ├── components/    # DataTable, Modal, Toast, Icon, Layout
│   └── directives/    # HasRole directive
├── store/             # State management (if needed)
└── types/             # TypeScript interfaces
```

---

<a id="tech-stack"></a>

## 🛠️ Tech Stack

### Backend

| Technology            | Version | Purpose           |
| --------------------- | ------- | ----------------- |
| .NET                  | 9.0     | Framework         |
| ASP.NET Core          | 9.0     | Web API           |
| Entity Framework Core | 8.0     | ORM               |
| MySQL                 | 8.0     | Database          |
| FluentValidation      | Latest  | Input validation  |
| AutoMapper            | Latest  | Object mapping    |
| JWT Bearer            | Latest  | Authentication    |
| Swagger/OpenAPI       | Latest  | API documentation |

### Frontend

| Technology         | Version | Purpose                           |
| ------------------ | ------- | --------------------------------- |
| Angular            | 20.3.4  | Framework (Standalone Components) |
| Tailwind CSS       | 4.x     | Styling                           |
| Angular Router     | 20.x    | Routing (Lazy Loading)            |
| Angular HttpClient | 20.x    | HTTP requests                     |
| Material Icons     | Latest  | Icon system                       |
| RxJS               | Latest  | Reactive programming              |

### DevOps & Tools

| Tool       | Purpose                     |
| ---------- | --------------------------- |
| Docker     | Containerization (optional) |
| Git        | Version control             |
| VS Code    | IDE                         |
| Swagger UI | API testing                 |

---

<a id="cau-truc-du-an"></a>

## 📁 Cấu Trúc Dự Án

```
store_management/
├── 📄 README.md                    # File này
├── 📄 .gitignore                   # Git ignore rules
│
├── 📂 store_management_BE/         # Backend (.NET 9)
│   ├── 📄 docker-compose.yml       # Docker services
│   ├── 📄 README.md                # Backend documentation
│   ├── 📄 Store Management Full.sql # Database schema & seed
│   ├── 📄 StoreManagement.sln      # Solution file
│   │
│   ├── 📂 StoreManagement.API/     # Presentation Layer
│   │   ├── Controllers/            # API Controllers
│   │   ├── Middleware/             # Exception handling
│   │   ├── Authorization/          # Auth handlers
│   │   └── appsettings.*.json      # Configurations
│   │
│   ├── 📂 StoreManagement.Application/  # Business Logic
│   │   ├── Services/               # Application services
│   │   ├── DTOs/                   # Data Transfer Objects
│   │   ├── Validators/             # FluentValidation
│   │   └── Mappings/               # AutoMapper profiles
│   │
│   ├── 📂 StoreManagement.Infrastructure/  # Data Access
│   │   ├── Data/                   # DbContext
│   │   ├── Repositories/           # Repository implementations
│   │   └── Migrations/             # EF Core migrations
│   │
│   ├── 📂 StoreManagement.Domain/  # Core Layer
│   │   ├── Entities/               # Domain entities
│   │   ├── Enums/                  # Enumerations
│   │   └── Interfaces/             # Repository interfaces
│   │
│   └── 📂 doc/                     # Backend documentation
│
└── 📂 store_management_FE/         # Frontend (Angular 20)
    ├── 📄 package.json             # NPM dependencies
    ├── 📄 angular.json             # Angular config
    ├── 📄 tailwind.config.cjs      # Tailwind config
    ├── 📄 README.md                # Frontend documentation
    │
    ├── 📂 src/
    │   ├── 📂 app/
    │   │   ├── apis/               # API services
    │   │   ├── core/               # Guards, Interceptors
    │   │   ├── features/           # Feature modules
    │   │   ├── shared/             # Shared components
    │   │   └── types/              # TypeScript interfaces
    │   ├── 📂 assets/              # Static assets
    │   └── 📂 environments/        # Environment configs
    │
    └── 📂 doc/                     # Frontend documentation
```

---

<a id="yeu-cau-he-thong"></a>

## 💻 Yêu Cầu Hệ Thống

| Requirement | Version | Notes                                                        |
| ----------- | ------- | ------------------------------------------------------------ |
| .NET SDK    | 9.0+    | [Download](https://dotnet.microsoft.com/download/dotnet/9.0) |
| Node.js     | 20+     | [Download](https://nodejs.org/)                              |
| npm         | 10+     | Included with Node.js                                        |
| MySQL       | 8.0     | Local or Docker                                              |
| Git         | Latest  | Version control                                              |

### Optional

- Docker & Docker Compose (for MySQL container)
- VS Code với extensions: C#, Angular Language Service, Tailwind CSS IntelliSense

---

<a id="cai-dat--khoi-chay"></a>

## 🚀 Cài Đặt & Khởi Chạy

### 1️⃣ Clone Repository

```bash
git clone https://github.com/caiquangtung/store_management.git
cd store_management
```

### 2️⃣ Database Setup

#### Option A: MySQL Local

```bash
# Start MySQL service
# macOS
brew services start mysql

# Linux
sudo systemctl start mysql

# Windows
net start MySQL80

# Create database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS store_management;"

# Import schema & seed data
mysql -u root -p store_management < store_management_BE/"Store Management Full.sql"

# Verify
mysql -u root -p -e "USE store_management; SHOW TABLES;"
```

#### Option B: Docker Compose

```bash
cd store_management_BE
docker-compose up -d mysql
```

### 3️⃣ Backend Setup

```bash
cd store_management_BE

# Configure database connection
# Edit StoreManagement.API/appsettings.Development.json
# Update ConnectionStrings:DefaultConnection with your MySQL credentials

# Restore packages
dotnet restore

# Run API
dotnet run --project StoreManagement.API
```

✅ API sẽ chạy tại: `http://localhost:5000`
✅ Swagger UI: `http://localhost:5000/swagger`

### 4️⃣ Frontend Setup

```bash
cd store_management_FE

# Install dependencies
npm install

# Start development server
ng serve
```

✅ App sẽ chạy tại: `http://localhost:4200`

### 5️⃣ Verify Installation

```bash
# Test API login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "123456"}'

# Or open browser
open http://localhost:4200
```

---

<a id="cau-hinh"></a>

## ⚙️ Cấu Hình

### Backend Configuration

**`store_management_BE/StoreManagement.API/appsettings.Development.json`**

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=store_management;Uid=root;Pwd=YOUR_PASSWORD;"
  },
  "JwtSettings": {
    "Secret": "your_secret_key_at_least_32_characters_long",
    "Issuer": "StoreManagementAPI",
    "Audience": "StoreManagementClient",
    "ExpireMinutes": 1440
  }
}
```

### Frontend Configuration

**`store_management_FE/src/environments/environment.ts`**

```typescript
export const environment = {
  production: false,
  apiUrl: "http://localhost:5000/api",
};
```

### Tailwind CSS Setup

Đảm bảo file `postcss.config.cjs` tồn tại:

```javascript
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

---

<a id="api-endpoints"></a>

## 🔌 API Endpoints

### Authentication

| Method | Endpoint            | Description   |
| ------ | ------------------- | ------------- |
| POST   | `/api/auth/login`   | Đăng nhập     |
| POST   | `/api/auth/refresh` | Refresh token |
| POST   | `/api/auth/logout`  | Đăng xuất     |

### Users (Admin only)

| Method | Endpoint          | Description     |
| ------ | ----------------- | --------------- |
| GET    | `/api/users`      | Danh sách users |
| GET    | `/api/users/{id}` | Chi tiết user   |
| POST   | `/api/users`      | Tạo user        |
| PUT    | `/api/users/{id}` | Cập nhật user   |
| DELETE | `/api/users/{id}` | Xóa user        |

### Products

| Method | Endpoint             | Description        |
| ------ | -------------------- | ------------------ |
| GET    | `/api/products`      | Danh sách sản phẩm |
| GET    | `/api/products/{id}` | Chi tiết sản phẩm  |
| POST   | `/api/products`      | Tạo sản phẩm       |
| PUT    | `/api/products/{id}` | Cập nhật sản phẩm  |
| DELETE | `/api/products/{id}` | Xóa sản phẩm       |

### Orders

| Method | Endpoint                    | Description        |
| ------ | --------------------------- | ------------------ |
| GET    | `/api/orders`               | Danh sách đơn hàng |
| GET    | `/api/orders/{id}`          | Chi tiết đơn hàng  |
| POST   | `/api/orders`               | Tạo đơn hàng       |
| POST   | `/api/orders/{id}/items`    | Thêm sản phẩm      |
| POST   | `/api/orders/{id}/checkout` | Thanh toán         |

### Inventory

| Method | Endpoint                     | Description       |
| ------ | ---------------------------- | ----------------- |
| GET    | `/api/inventory`             | Danh sách tồn kho |
| GET    | `/api/inventory/low-stock`   | Hàng sắp hết      |
| POST   | `/api/inventory/adjustments` | Điều chỉnh kho    |

### Reports

| Method | Endpoint                           | Description         |
| ------ | ---------------------------------- | ------------------- |
| GET    | `/api/reports/sales/overview`      | Tổng quan doanh thu |
| GET    | `/api/reports/products/dead-stock` | Sản phẩm không bán  |
| GET    | `/api/reports/inventory/ledger`    | Sổ kho              |

> 📖 Xem chi tiết tất cả endpoints tại [Backend README](store_management_BE/README.md)

---

<a id="database"></a>

## 🗄️ Database

### Database Schema

| Table                   | Description         |
| ----------------------- | ------------------- |
| `users`                 | Người dùng hệ thống |
| `customers`             | Khách hàng          |
| `categories`            | Danh mục sản phẩm   |
| `products`              | Sản phẩm            |
| `suppliers`             | Nhà cung cấp        |
| `inventory`             | Tồn kho             |
| `inventory_adjustments` | Điều chỉnh kho      |
| `orders`                | Đơn hàng            |
| `order_items`           | Chi tiết đơn hàng   |
| `payments`              | Thanh toán          |
| `promotions`            | Khuyến mãi          |
| `purchases`             | Đơn nhập hàng       |
| `purchase_items`        | Chi tiết nhập hàng  |

### Migrations

```bash
cd store_management_BE

# Add migration
dotnet ef migrations add MigrationName --project StoreManagement.Infrastructure --startup-project StoreManagement.API

# Update database
dotnet ef database update --project StoreManagement.Infrastructure --startup-project StoreManagement.API
```

---

<a id="scripts-thuong-dung"></a>

## 📜 Scripts Thường Dùng

### Backend

```bash
# Restore packages
dotnet restore

# Build
dotnet build

# Run (Development)
dotnet run --project StoreManagement.API

# Run (Production)
dotnet publish -c Release -o ./publish
dotnet ./publish/StoreManagement.API.dll

# Test
dotnet test
```

### Frontend

```bash
# Install dependencies
npm install

# Start dev server
ng serve

# Build production
ng build --configuration production

# Lint
ng lint

# Test
ng test

# Generate component
ng generate component features/products/product-form --standalone

# Generate service
ng generate service apis/product
```

---

<a id="testing--quality"></a>

## 🧪 Testing & Quality

### Backend

- **Validation**: FluentValidation cho tất cả input
- **Error Handling**: Global Exception Middleware
- **Unit Tests**: `dotnet test` (nếu có test project)

### Frontend

- **Unit Tests**: Karma/Jasmine (`ng test`)
- **E2E Tests**: Playwright/Cypress (nếu configured)
- **Linting**: ESLint (`ng lint`)

### API Testing

1. Mở Swagger UI: `http://localhost:5000/swagger`
2. Click **Authorize**, nhập JWT token
3. Test các endpoints

---

<a id="tai-khoan-mac-dinh"></a>

## 👤 Tài Khoản Mặc Định

| Role  | Username  | Password |
| ----- | --------- | -------- |
| Admin | `admin`   | `123456` |
| Staff | `staff01` | `123456` |

> ⚠️ **Lưu ý**: Đổi mật khẩu khi deploy production!

---

<a id="screenshots"></a>

## 📸 Screenshots

> _Thêm screenshots của ứng dụng ở đây_

### Dashboard

- KPI Cards (Sales, Orders, Customers)
- Recent Orders với modal detail view
- Modern gradient UI

### Products

- Product list với pagination
- Create/Edit form
- Category filtering

### Orders

- Order list với status filter
- POS-style order creation
- Checkout flow

---

<a id="tai-lieu"></a>

## 📚 Tài Liệu

### Backend Documentation (`store_management_BE/doc/`)

| Document                                                                                     | Description                |
| -------------------------------------------------------------------------------------------- | -------------------------- |
| [Authentication Implementation](store_management_BE/doc/Authentication_Implementation.md)    | JWT authentication details |
| [Authorization Implementation](store_management_BE/doc/Authorization_Implementation.md)      | Role-based access control  |
| [API Reports Documentation](store_management_BE/doc/API_Reports_Doc.md)                      | Report endpoints           |
| [Order Management API](store_management_BE/doc/Order_Management_API_Implementation.md)       | Order workflow             |
| [Inventory API](store_management_BE/doc/Inventory_API_Implementation.md)                     | Inventory management       |
| [Project Architecture](store_management_BE/doc/Project_Layer_Architecture_and_References.md) | Clean Architecture details |

### Frontend Documentation (`store_management_FE/`)

| Document                                                            | Description         |
| ------------------------------------------------------------------- | ------------------- |
| [Frontend README](store_management_FE/README.md)                    | Full frontend guide |
| [Dashboard Refactor](store_management_FE/DASHBOARD_REFACTOR.md)     | SPA architecture    |
| [Material Icons Guide](store_management_FE/MATERIAL_ICONS_GUIDE.md) | Icon usage          |
| [Quick Start SPA](store_management_FE/QUICK_START_SPA.md)           | Quick reference     |

---

<a id="dong-gop"></a>

## 🤝 Đóng Góp

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Mở Pull Request

### Commit Convention

```
feat: Add new feature
fix: Bug fix
docs: Documentation changes
style: Code style changes (formatting, etc.)
refactor: Code refactoring
test: Add tests
chore: Build/tooling changes
```

---

<a id="license"></a>

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Developer**: Cai Quang Tung
- **Repository**: [github.com/caiquangtung/store_management](https://github.com/caiquangtung/store_management)

---

<p align="center">
  <strong>Happy Coding! 🚀</strong>
</p>
