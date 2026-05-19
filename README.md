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
Monolithic Architecture (Lecture 2)
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
│   │   ├── db.js              # MongoDB connection
│   │   └── cloudinary.js      # Cloudinary + Multer setup
│   ├── controllers/
│   │   ├── authController.js  # Register, login, profile
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── userController.js
│   │   └── notificationController.js
│   ├── middleware/
│   │   ├── auth.js            # JWT protect + authorize
│   │   ├── errorHandler.js    # Centralized error handling
│   │   └── upload.js          # Multer file upload
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
│   │   └── index.js           # Socket.io event handlers
│   ├── app.js                 # Express app config
│   ├── server.js              # Entry point + HTTP + Socket.io
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
    │   │   ├── AuthContext.jsx    # Global auth state
    │   │   └── CartContext.jsx    # Global cart state
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
    │   │   └── api.js             # Axios instance
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

- Node.js v18+
- MongoDB Atlas account (free tier works)
- Cloudinary account (free tier works)

---

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/senshop.git
cd senshop
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create your `.env` file:

```bash
cp .env.example .env
```

Fill in your `.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/ecommerce
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Run the backend:

```bash
npm run server
```

The server starts at `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create your `.env` file:

```bash
cp .env.example .env
```

Fill in your `.env`:

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

Run the frontend:

```bash
npm run dev
```

The app opens at `http://localhost:5173`

---

### 4. Create an Admin Account

1. Register normally at `http://localhost:5173/register`
2. Open MongoDB Atlas → Browse Collections → users collection
3. Find your user document and change `"role": "client"` → `"role": "admin"`
4. Log out and log back in — you now have admin access

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

Wave and Orange Money are simulated for educational purposes:

1. User selects Wave or Orange Money at checkout
2. App shows payment instructions screen
3. User confirms payment manually
4. Order is marked as `paid` and `confirmed`

> In production, replace with official Wave API or Orange Money API.

---

## Deployment

### Backend → Render

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add all environment variables from `.env`
6. Deploy

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repository
3. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
4. Add environment variables:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api/v1
   VITE_SOCKET_URL=https://your-backend.onrender.com
   ```
5. Deploy

### MongoDB Atlas Setup

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free M0 cluster
3. Create a database user with read/write permissions
4. Add `0.0.0.0/0` to IP Access List (or Render's IP)
5. Copy the connection string to `MONGO_URI`

### Cloudinary Setup

1. Go to [cloudinary.com](https://cloudinary.com) → Sign up free
2. Dashboard → copy Cloud Name, API Key, API Secret
3. Add to backend `.env`

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

---

## Tech Stack

| Layer           | Technology                                   |
| --------------- | -------------------------------------------- |
| Frontend        | React 18, Vite, TailwindCSS, React Router v6 |
| HTTP Client     | Axios                                        |
| Charts          | Recharts                                     |
| Backend         | Node.js, Express.js                          |
| Database        | MongoDB + Mongoose                           |
| Authentication  | JWT + bcrypt                                 |
| Real-time       | Socket.io                                    |
| Image Upload    | Multer + Cloudinary                          |
| Logging         | Morgan                                       |
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

##  Contributing

This is an educational project. Feel free to fork and extend it with:

- Real Wave/Orange Money API integration
- Email notifications (Nodemailer)
- Product wishlist
- Discount codes
- Admin analytics export

```
