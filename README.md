# SenShop — Full-Stack E-Commerce Platform

> **Educational Full-Stack Project** | React + Vite + Express + MongoDB  
> Built for a backend development university course — demonstrating REST APIs, JWT auth, real-time notifications, and more.

---

## Project Overview

SenShop is an Amazon-style e-commerce platform for Senegal, supporting:

- **Wave** and **Orange Money** payment integration (mock)
- Real-time notifications via **Socket.io**
- **JWT authentication** with role-based access
- **Cloudinary** image uploads
- **WhatsApp** customer support integration

---

## 📐 Architecture

```
Monolithic Architecture
┌──────────────────────────────────────┐
│           React Frontend             │  ← Vercel
│         (Vite + TailwindCSS)         │
└──────────────┬───────────────────────┘
               │ HTTP + WebSocket
┌──────────────▼───────────────────────┐
│         Express.js Backend           │  ← Render
│   REST API + Socket.io server        │
└──────────────┬───────────────────────┘
               │ Mongoose ODM
┌──────────────▼───────────────────────┐
│           MongoDB Atlas              │  ← Cloud DB
└──────────────────────────────────────┘
```

---

## Project Structure

```
ecommerce/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── cloudinary.js
│   ├── controllers/
│   │   ├── authController.js  # Register, login, profile
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── userController.js
│   │   └── notificationController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── upload.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── userRoutes.js
│   │   └── notificationRoutes.js
│   ├── sockets/
│   │   └── index.js
│   ├── app.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── ProductCard.jsx
    │   │   ├── NotificationBell.jsx
    │   │   └── WhatsAppButton.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── CartContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Products.jsx
    │   │   ├── ProductDetail.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── client/
    │   │   │   ├── Cart.jsx
    │   │   │   ├── Checkout.jsx
    │   │   │   ├── OrderHistory.jsx
    │   │   │   ├── OrderDetail.jsx
    │   │   │   └── Profile.jsx
    │   │   └── admin/
    │   │       ├── Dashboard.jsx
    │   │       ├── Products.jsx
    │   │       ├── Orders.jsx
    │   │       └── Users.jsx
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env.example
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## Installation & Setup

### Prerequisites

- Node.js
- MongoDB Atlas account
- Cloudinary account

---

## 📡 REST API Reference

### Auth Routes

| Method | Endpoint                      | Access  | Description      |
| ------ | ----------------------------- | ------- | ---------------- |
| POST   | `/api/v1/auth/register`       | Public  | Register user    |
| POST   | `/api/v1/auth/login`          | Public  | Login + get JWT  |
| GET    | `/api/v1/auth/me`             | Private | Get current user |
| PUT    | `/api/v1/auth/update-profile` | Private | Update profile   |

### Product Routes

| Method | Endpoint                       | Access | Description             |
| ------ | ------------------------------ | ------ | ----------------------- |
| GET    | `/api/v1/products`             | Public | List all (with filters) |
| GET    | `/api/v1/products/:id`         | Public | Get single product      |
| POST   | `/api/v1/products`             | Admin  | Create product          |
| PUT    | `/api/v1/products/:id`         | Admin  | Update product          |
| DELETE | `/api/v1/products/:id`         | Admin  | Delete product          |
| POST   | `/api/v1/products/:id/reviews` | Client | Add review              |

### Order Routes

| Method | Endpoint                     | Access  | Description   |
| ------ | ---------------------------- | ------- | ------------- |
| POST   | `/api/v1/orders`             | Client  | Place order   |
| GET    | `/api/v1/orders/my-orders`   | Client  | My orders     |
| GET    | `/api/v1/orders/:id`         | Private | Order detail  |
| GET    | `/api/v1/orders`             | Admin   | All orders    |
| PUT    | `/api/v1/orders/:id/status`  | Admin   | Update status |
| GET    | `/api/v1/orders/admin/stats` | Admin   | Statistics    |

### Query Parameters for Products

```
GET /api/v1/products?keyword=phone&category=Electronics&minPrice=5000&maxPrice=500000&sort=price&page=1&limit=12
```

---

## Authentication Flow

```
1. Client sends: POST /api/v1/auth/login { email, password }
2. Server verifies password with bcrypt.compare()
3. Server signs JWT: jwt.sign({ id: user._id }, JWT_SECRET)
4. Client stores token in localStorage
5. Client sends token in header: Authorization: Bearer <token>
6. protect middleware verifies token on every protected request
```

---

## Real-Time Notifications (Socket.io)

```
1. Client connects to Socket.io with JWT token
2. Server authenticates socket using jwt.verify()
3. Client joins a room named after their userId
4. When an order is placed → server emits to user's room
5. When admin updates order → server emits status update
6. Client sees notification instantly without page refresh
```

---

## Payment Integration (Mock)

Wave and Orange Money are simulated :

1. User selects Wave or Orange Money at checkout
2. App shows payment instructions screen
3. User confirms payment manually
4. Order is marked as `paid` and `confirmed`

In production, replace with official Wave API or Orange Money API.

---

## Educational Concepts Covered

| Concept                     | File(s)                                               |
| --------------------------- | ----------------------------------------------------- |
| REST API design             | `routes/*.js`, `controllers/*.js`                     |
| HTTP methods & status codes | All controllers                                       |
| Express middleware          | `middleware/auth.js`, `middleware/errorHandler.js`    |
| JWT authentication          | `controllers/authController.js`, `middleware/auth.js` |
| Role-based authorization    | `middleware/auth.js`                                  |
| MongoDB schemas             | `models/*.js`                                         |
| Mongoose ODM                | All models                                            |
| bcrypt password hashing     | `models/User.js`                                      |
| File uploads (Multer)       | `middleware/upload.js`                                |
| WebSockets vs HTTP          | `sockets/index.js`                                    |
| Real-time communication     | `sockets/index.js`, `components/NotificationBell.jsx` |
| MVC architecture            | `models/`, `controllers/`, `routes/`                  |
| Monolithic vs microservices | `app.js` comments                                     |
| Environment variables       | `.env.example`                                        |
| CORS                        | `app.js`                                              |
| Pagination & filtering      | `controllers/productController.js`                    |
| React Context API           | `context/AuthContext.jsx`, `context/CartContext.jsx`  |
| Protected routes            | `App.jsx`                                             |

---

## User Roles

| Feature              | Client | Admin |
| -------------------- | ------ | ----- |
| Browse products      | 1      | 1     |
| Search & filter      | 1      | 1     |
| Add to cart          | 1      | 1     |
| Place orders         | 1      | 0     |
| View own orders      | 1      | 1     |
| Write reviews        | 1      | 0     |
| Edit profile         | 1      | 1     |
| Create products      | 0      | 1     |
| Edit/delete products | 0      | 1     |
| Manage all orders    | 0      | 1     |
| Manage users         | 0      | 1     |
| View dashboard       | 0      | 1     |

admin:admin@gmail.com
password:123456

---

## Tech Stack

| Layer           | Technology                                   |
| --------------- | -------------------------------------------- |
| Frontend        | React 18, Vite, TailwindCSS, React Router v6 |
| HTTP Client     | Axios                                        |
| Charts          | Recharts (React Library)                     |
| Backend         | Node.js, Express.js                          |
| Database        | MongoDB + Mongoose                           |
| Authentication  | JWT + bcrypt                                 |
| Real-time       | Socket.io                                    |
| Image Upload    | Multer + Cloudinary                          |
| Logging         | Morgan (middleware use in node.js)           |
| Frontend Deploy | Vercel                                       |
| Backend Deploy  | Render                                       |
| Database Host   | MongoDB Atlas                                |

---

## Security Best Practices

- Passwords hashed with bcrypt (salt rounds: 12)
- JWT stored client-side, verified server-side on every request
- Passwords excluded from DB queries by default (`select: false`)
- CORS configured to allow only the frontend origin
- Environment variables for all secrets
- Role checks on every protected admin route
- Input validation via Mongoose schema validators

---

## WhatsApp Support

A floating WhatsApp button appears on all public pages.  
Update the support number in `src/components/WhatsAppButton.jsx`:

```js
const SUPPORT_NUMBER = "+221771797377";

---
```
