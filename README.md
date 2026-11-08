# Nexora – Full Stack E-Commerce Website

Nexora is a full-stack e-commerce web application developed as part of the CodeAlpha Full Stack Development Internship. It provides an online shopping platform with product management, user authentication, shopping cart, checkout, and order management functionality.

## 🚀 Features

- User Registration and Login
- User Authentication
- Product Listing and Product Details
- Shopping Cart
- Add and Manage Products
- Admin Dashboard
- Product Image Upload
- Checkout Page
- Order Management
- MongoDB Database Integration
- RESTful API using Express.js

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcryptjs
- Multer
- CORS
- dotenv

### Development Tools
- Visual Studio Code
- Postman
- Git and GitHub
- MongoDB Atlas

## 📁 Project Structure

```text
codealpha_ecommerce/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── orderController.js
│   │   └── productController.js
│   │
│   ├── middleware/
│   │   ├── adminOnly.js
│   │   ├── auth.js
│   │   └── upload.js
│   │
│   ├── models/
│   │   ├── order.js
│   │   └── Product.js
│   │
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   └── uploadRoutes.js
│   │
│   ├── uploads/
│   │
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   ├── add-product.html
│   ├── add-product.js
│   ├── admin.html
│   ├── admin.js
│   ├── auth.css
│   ├── auth.js
│   ├── cart.html
│   ├── checkout.html
│   ├── dashboard.html
│   ├── dashboard.js
│   ├── login.html
│   ├── navigation.js
│   ├── product.html
│   ├── register.html
│   ├── script.js
│   └── style.css
│
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate to the Project

```bash
cd codealpha_ecommerce
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Replace the placeholder values with your own MongoDB connection string and a strong secret key.

**Important:** Never upload your `.env` file or expose your database credentials and JWT secret on GitHub.

### 5. Start the Backend Server

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The backend server will run at:

```text
http://localhost:5000
```

## 🔗 API Routes

| Route | Description |
|---|---|
| `/` | API server status |
| `/api/auth` | Authentication |
| `/api/admin` | Admin operations |
| `/api/products` | Product operations |
| `/api/orders` | Order operations |
| `/api/uploads` | File upload |

## 🗄️ Database

Nexora uses MongoDB with Mongoose for database management.

The database connection is configured through the `MONGODB_URI` environment variable.

## 🧪 API Testing

Postman is used to test backend API endpoints and verify API responses.

## 🔐 Security

- Password hashing using bcryptjs
- JWT-based authentication support
- Protected routes and admin middleware
- Environment variables for sensitive configuration

## 👨‍💻 Developer

**Huzaifa Khan**

Full Stack Development Student

GitHub: https://github.com/Huzaifakkhan-devv

## 📌 Internship

Developed as part of the **CodeAlpha Full Stack Development Internship**.

---

⭐ If you find this project useful, feel free to explore the repository and give it a star!
