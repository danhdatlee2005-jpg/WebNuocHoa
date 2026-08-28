# Luxury Scent - Microservices E-commerce Platform

## Kiến trúc hệ thống

```
[Next.js Frontend :3000]
        │
        ▼
[Kong API Gateway :8000]
        │
   ┌────┴─────────────────────────────────────────────┐
   │              Microservices Layer                  │
   ├──────────┬───────────┬────────────┬──────────────┤
[Auth :8081][User :8082][Product :8083][Cart :8084]
[Wishlist :8085][Order :8086][Inventory :8087]
[Payment :8088][Promotion :8089][Shipping :8090]
[Review :8091][Notification :8092][Admin :8093]
        │
        ▼
[RabbitMQ :5672]  ◄──── Saga Pattern Event Bus
        │
        ▼
[PostgreSQL :5432] ◄──── 13 Databases (1 per service)
```

## Công nghệ sử dụng

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS |
| **API Gateway** | Kong (DB-less mode) |
| **Backend** | Spring Boot 3.2.5, Java 17 |
| **Message Broker** | RabbitMQ 3 |
| **Database** | PostgreSQL 15 |
| **Containerization** | Docker, Docker Compose |
| **CI/CD** | GitLab CI/CD |

## Cách khởi chạy

### 1. Khởi động Backend + Infrastructure

```bash
cd d:/Web_NH_Microservice

# Build JAR files
cd backend && mvn clean package -DskipTests && cd ..

# Khởi động toàn bộ hệ thống (lần đầu)
docker-compose up -d --build

# Các lần tiếp theo (không cần rebuild)
docker-compose up -d
```

### 2. Khởi động Frontend

```bash
cd d:/Web_NH_Microservice/frontend
npm run dev
```

## Địa chỉ truy cập

| Service | URL |
|---|---|
| **Storefront** | http://localhost:3000 |
| **Admin Dashboard** | http://localhost:3000/admin |
| **Kong API Gateway** | http://localhost:8000 |
| **RabbitMQ Management** | http://localhost:15672 (guest/guest) |

## Danh sách tính năng (F01 - F64)

- ✅ **F01-F05**: Đăng ký, Đăng nhập, JWT Refresh, Logout, Quên mật khẩu
- ✅ **F06-F11**: Quản lý hồ sơ cá nhân, địa chỉ giao hàng
- ✅ **F12-F19**: Danh mục sản phẩm, tìm kiếm, lọc theo thông số
- ✅ **F20-F24**: Giỏ hàng CRUD
- ✅ **F25-F27**: Wishlist yêu thích
- ✅ **F28-F32**: Checkout, quản lý đơn hàng (Saga Pattern)
- ✅ **F33-F36**: Quản lý tồn kho
- ✅ **F37-F40**: Khởi tạo thanh toán, xử lý webhook
- ✅ **F41-F43**: Mã giảm giá (Coupon/Promotion)
- ✅ **F44-F46**: Tính phí vận chuyển, tạo lô hàng, theo dõi
- ✅ **F47-F50**: Đánh giá sản phẩm (chỉ sau khi DELIVERED)
- ✅ **F51-F55**: Thông báo hệ thống (RabbitMQ Consumer)
- ✅ **F56**: Admin Dashboard thống kê
- ✅ **F57-F64**: Admin quản lý users, products, orders

## Luồng Saga Pattern (Order → Inventory → Payment → Shipping)

```
User Checkout
    │
    ▼
order-service ──publishes──► OrderCreatedEvent
                                    │
                                    ▼
                         inventory-service (reserves stock)
                                    │
                            InventoryReservedEvent
                                    │
                                    ▼
                         payment-service (processes payment)
                                    │
                            PaymentCompletedEvent
                                    │
                                    ▼
                         shipping-service (creates shipment)
                                    │
                         notification-service (sends notifications)
```
