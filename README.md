# 🌱 DK Seed Store Website

A full-stack e-commerce web application developed for purchasing agricultural seeds online.

DK Seed Store provides a responsive shopping experience where users can browse agricultural seed products, search and filter products, view product details, manage their shopping cart, create an account, manage their profile and shipping address, place orders, track order history, and make payments through Cash on Delivery or Razorpay.

The application is built using **React.js, Vite, Node.js, Express.js, MongoDB Atlas, Mongoose, JWT, and Razorpay**.

> **Note:** This repository contains both the frontend and backend of the application.

---

## 🚀 Live Demo

### 🌐 Frontend
https://dk-seed-store-website-2026.vercel.app

### ⚙️ Backend
https://dk-seed-store-website-2026.onrender.com

### 🗄️ Database
MongoDB Atlas

The frontend is deployed on **Vercel**, the backend is deployed on **Render**, and MongoDB Atlas is used as the production database.

---

## 📂 Project Structure

```text
dk-seed-store-website-2026/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── pages/
│   │   └── styles/
│   ├── package.json
│   ├── vite.config.js
│   └── .gitignore
│
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── package.json
│   └── server.js
│
├── .gitignore
├── README.md
└── vercel.json

✨ Features
🌱 Product Features
🌱 Browse agricultural seed products
🔍 Search products
📂 Category-wise product filtering
📄 Product details page
🖼️ Product images
💰 Product pricing
📦 Product stock information
🔄 Dynamic product data through REST APIs
🚫 Stock-based quantity validation
📊 Backend-connected product management
👤 User Authentication
📝 User registration
🔐 User login
🚪 User logout
🔑 JWT-based authentication
🛡️ Protected API routes
👤 Current user authentication
🔒 Protected order functionality
🔒 Protected payment functionality
👤 User Profile

Logged-in users can manage their personal and shipping information.

Users can update:

👤 Name
📱 Phone number
📍 Street address
🏙️ City
🗺️ State
📮 Pincode

Profile information is stored securely in MongoDB and can be used during the checkout process.

📍 Shipping Address
Save shipping address to user profile
Retrieve saved address during checkout
Validate required address information
Redirect users to profile when required address information is incomplete
🛒 Shopping Cart
➕ Add products to cart
🔢 Increase product quantity
❌ Remove products from cart
🗑️ Clear cart
💰 Automatic subtotal calculation
💵 Automatic total calculation
📦 Stock-based quantity validation
🚫 Prevent adding products beyond available stock
💾 Persistent cart storage using localStorage
👥 Separate cart for each logged-in user
🛍️ Separate guest cart
📦 Order Management

Authenticated users can place and manage their orders.

Features include:

🛒 Create orders
📦 View order history
🧾 View ordered products
🔢 View product quantities
💰 View order totals
📅 View order dates
🚚 Track order status
📍 Store shipping address with orders
💳 Store payment method
💰 Track payment status

Supported order statuses include:

Pending
Confirmed
Shipped
Delivered
Cancelled
💳 Payment Methods
💵 Cash on Delivery

Users can place orders using Cash on Delivery.

COD orders support:

Order creation
Payment status tracking
Order history
Stock management
💳 Razorpay Online Payment

The application integrates Razorpay for online payments.

The payment system includes:

Razorpay Checkout
Razorpay order creation
Payment signature verification
Payment status management
Razorpay order ID tracking
Razorpay payment ID tracking
🔐 Online Payment Flow
User selects Online Payment
            ↓
Backend creates Razorpay Order
            ↓
MongoDB Order is created
            ↓
Razorpay Checkout Opens
            ↓
User completes payment
            ↓
Payment details returned to frontend
            ↓
Frontend sends payment details to backend
            ↓
Backend verifies Razorpay signature
            ↓
Payment confirmed
            ↓
Order processed
            ↓
Product stock updated

Payment verification is handled by the backend to provide a more secure payment flow.

📦 Stock Management
📊 Track product stock
🚫 Prevent unavailable quantities
➖ Decrease stock after successful purchase
🔄 Restore stock when required
🛡️ Backend stock validation
📦 Stock utility functions

Stock-related functionality is maintained in the backend utility layer.

🛠️ Admin Dashboard

The application includes a protected admin section for managing the store.

📊 Dashboard

Administrators can view information such as:

📦 Total products
🛒 Total orders
⏳ Pending orders
🚚 Shipped orders
✅ Delivered orders
💰 Total revenue
📦 Product Management

Administrators can:

➕ Add products
✏️ Update products
🗑️ Delete products
📊 Manage product stock
📄 View product information
📋 Order Management

Administrators can:

📦 View customer orders
👤 View customer information
💰 View order totals
💳 View payment information
📍 View shipping information
🚚 Update order status
📊 Monitor order activity
🛡️ Protected Admin Routes

Admin functionality is protected using authentication and admin authorization middleware.

Protected areas include:

/admin
/dashboard
/orders

Only authorized administrators can access these areas.

📱 Responsive Design

The application is designed to work across different screen sizes.

💻 Desktop layout
📱 Mobile layout
📐 Responsive components
🧭 Responsive navigation
📱 Mobile navigation menu
🛠️ Tech Stack
Frontend
React.js
Vite
React Router DOM
Context API
JavaScript
HTML5
CSS3
Backend
Node.js
Express.js
REST APIs
JWT Authentication
bcrypt.js
Mongoose
Database
MongoDB
MongoDB Atlas
Mongoose
Payment Gateway
Razorpay
Development Tools
Git
GitHub
VS Code
Postman
npm
Deployment
Vercel — Frontend
Render — Backend
MongoDB Atlas — Database
🔐 Authentication & Security

The application uses JWT-based authentication to protect user-specific functionality.

Authentication is used for:

User registration
User login
User profile access
Profile updates
Order creation
Order history
Payment operations
Admin functionality

Protected API requests use the following authorization format:

Authorization: Bearer <token>

User passwords are securely hashed using bcrypt before being stored.

Sensitive environment variables are stored in .env files and are excluded from Git.

🌐 API Architecture

The frontend communicates with the backend through REST APIs.

🔑 Authentication APIs
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
PUT    /api/auth/me

These APIs handle:

User registration
User login
Current user information
Profile updates
🌱 Product APIs
/api/products

Product APIs handle:

Fetching products
Creating products
Updating products
Deleting products
Product stock management
📦 Order APIs
/api/orders

Order APIs handle:

Creating orders
Fetching orders
User order history
Admin order management
Updating order status
Stock-related order operations
💳 Payment APIs
/api/payment

Payment APIs handle:

Razorpay order creation
Razorpay payment verification
Payment processing
📦 Installation
1. Clone the Repository
git clone https://github.com/RiyaGirdhar30/dk-seed-store-website-2026.git
cd dk-seed-store-website-2026
2. Install Frontend Dependencies
cd frontend
npm install

Start the frontend development server:

npm run dev
3. Install Backend Dependencies

Open another terminal and run:

cd backend
npm install

Start the backend server:

npm start
🔑 Environment Variables
Frontend

Create a .env file inside the frontend folder:

VITE_API_URL=http://localhost:7000
VITE_RAZORPAY_KEY_ID=YOUR_RAZORPAY_KEY_ID

For production deployment, the frontend uses the deployed Render backend URL through Vercel environment variables.

Backend

Create a .env file inside the backend folder:

MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
RAZORPAY_KEY_ID=YOUR_RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_RAZORPAY_KEY_SECRET
JWT_SECRET=YOUR_JWT_SECRET

Important: Never commit .env files, API secrets, Razorpay secrets, database credentials, or JWT secrets to GitHub.

📸 Screenshots

Screenshots of the following sections can be added here:

🏠 Home Page
🌱 Products Page
📄 Product Details
🛒 Shopping Cart
🔐 Login
📝 Signup
👤 User Profile
📦 Order History
💳 Payment
🛠️ Admin Dashboard
📋 Admin Order Management
🌐 Deployment Architecture
                    DK Seed Store
                          │
                          ▼
              ┌─────────────────────┐
              │       Vercel        │
              │   React Frontend    │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │       Render        │
              │ Node.js + Express   │
              │      Backend        │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │    MongoDB Atlas    │
              │      Database       │
              └─────────────────────┘
👩‍💻 Developed By

Riya Girdhar

GitHub: https://github.com/RiyaGirdhar30
LinkedIn: https://www.linkedin.com/in/riya-girdhar-a6074124a
⭐ If You Like This Project

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub!