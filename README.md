# E-commerce Backend API

A robust RESTful API for an e-commerce platform built with **Express**, **TypeScript**, and **Prisma ORM**.

## 🚀 Technologies

- **Runtime:** Node.js / Bun
- **Framework:** Express (v5.1.0)
- **Language:** TypeScript
- **Database ORM:** Prisma with MySQL
- **Validation:** Zod
- **Authentication:** JWT (JSON Web Token) & Bcryptjs
- **File Upload:** Multer
- **Development Tool:** Nodemon & tsx

## 📁 Project Structure

```text
src/
├── feature/              # Business logic organized by feature
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic & Zod schemas
│   └── repositories/     # Data access layer (Prisma)
├── middleware/           # Auth & Authorization middlewares
├── providers/            # Database provider (Prisma Client)
├── types/                # Global TypeScript definitions
├── utils/                # Utility services (e.g., File Upload)
└── index.ts              # Entry point
```

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- MySQL Database

### 2. Installation
```bash
cd backend
npm install
```

### 3. Environment Variables
Create a `.env` file in the `backend` directory:
```env
DATABASE_URL="mysql://user:password@localhost:3306/ecommerce_db"
JWT_SECRET="your_super_secret_key"
JWT_EXPIRES_IN="1h"
PORT=3001
UPLOADS_BASE_URL="http://localhost:3001"
```

### 4. Database Setup
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations to create tables
npx prisma migrate dev
```

### 5. Running the Server
```bash
# Development mode
npm run dev
```

## 🔑 Key Features

- **Authentication:** Register and login with password hashing.
- **RBAC:** Role-based access control (ADMIN and USER).
- **Product Management:** CRUD operations with image upload and category linking.
- **Cart System:** Sophisticated cart management with stock availability checks.
- **Order Processing:** Atomic transactions for order creation, total calculation, and stock decrement.
- **Reviews:** Product rating and comment system.
- **Address Management:** Users can manage multiple shipping addresses.

## 📊 Database Schema

```mermaid
erDiagram
    USER ||--o{ ADDRESS : "has"
    USER ||--o{ ORDER : "places"
    USER ||--o| CART : "owns"
    USER ||--o{ REVIEW : "writes"
    
    CATEGORY ||--o{ PRODUCT : "contains"
    
    PRODUCT ||--o{ ORDER_ITEM : "in"
    PRODUCT ||--o{ CART_ITEM : "in"
    PRODUCT ||--o{ REVIEW : "has"
    
    CART ||--o{ CART_ITEM : "contains"
    
    ORDER ||--o{ ORDER_ITEM : "contains"

    USER {
        string id PK
        string email UK
        string username UK
        string password
        string fullName
        string phone
        Role role
        datetime createdAt
        datetime updatedAt
    }

    ADDRESS {
        string id PK
        string userId FK
        string label
        string street
        string city
        string stateProvince
        string postalCode
        string country
        boolean isDefault
        datetime createdAt
        datetime updatedAt
    }

    CATEGORY {
        string id PK
        string name UK
    }

    PRODUCT {
        string id PK
        string name
        string description
        float price
        int stock
        string imgUrl
        string categoryId FK
        datetime createdAt
        datetime updatedAt
    }

    CART {
        string id PK
        string userId FK "unique"
        datetime updatedAt
    }

    CART_ITEM {
        string id PK
        string cartId FK
        string productId FK
        int quantity
    }

    ORDER {
        string id PK
        string userId FK
        float totalAmount
        string address
        OrderStatus status
        datetime createdAt
        datetime updatedAt
    }

    ORDER_ITEM {
        string id PK
        string orderId FK
        string productId FK
        int quantity
        float price
    }

    REVIEW {
        string id PK
        int rating
        string comment
        string userId FK
        string productId FK
        datetime createdAt
    }
```

## 📬 API Documentation
The API endpoints are organized under `/api/v1/`. You can find sample request collections in the `Ecommerce/` folder (compatible with [Bruno](https://www.usebruno.com/)).
