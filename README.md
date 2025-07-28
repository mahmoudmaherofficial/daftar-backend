# 📘 Daftar - دفتر

**Daftar (دفتر)** is a full-featured **Invoice Management System** built using **Node.js**, **Express**, **MongoDB**, and **Next.js (App Router)**.  
It enables users to manage invoices, products, customers, inventory, and generate detailed sales reports through a clean and modern UI.

---

## 📦 Project Structure

```
daftar/
│
├── backend/        # Node.js + Express API
└── frontend/       # Next.js App (App Router)
```

---

## 🚀 Features

### 🔧 Backend (Express + MongoDB)
- JWT Authentication with Role-based Access
- RESTful APIs for Users, Products, Invoices, and Customers
- Inventory transactions and stock management
- Advanced reports (Revenue, Stock, Sales, etc.)

### 🎨 Frontend (Next.js + Tailwind CSS)
- Role-based dashboard (Admin, Seller)
- Create & manage invoices
- Manage customers & products
- Inventory management UI
- Sales & performance reports
- PDF invoice generation
- Fully responsive design

---

## 🌐 Live Demo

_coming soon..._

---

## 📂 Postman Collection

You can test all APIs using the included Postman collection:  
📁 `postman/daftar.postman_collection.json`

---

## 🧰 Tech Stack

| Layer     | Technology                         |
|-----------|------------------------------------|
| Frontend  | Next.js (App Router), Tailwind CSS |
| Backend   | Node.js, Express, MongoDB, JWT     |
| Database  | MongoDB Atlas                      |
| Auth      | JWT + Custom Roles (Admin/Seller)  |

---

## 📊 Available Reports

- 📆 Daily Revenue
- 📉 Low Stock Products
- 📦 Sales by Product
- 💸 Unpaid Invoices
- 👥 Revenue by Customer
- 🔄 Inventory Movement
- 📈 Monthly Sales

---

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/daftar.git
cd daftar
```

---

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside `/backend`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
```

Run the backend:

```bash
npm run dev
```

---

### 3. Setup Frontend

```bash
cd frontend
npm install
```

Create a `.env.local` file inside `/frontend`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Run the frontend:

```bash
npm run dev
```

Frontend will be running at: [http://localhost:3000](http://localhost:3000)

---

## 👨‍💻 Author

**Daftar - دفتر** built with 💙 by [Your Name]  
Feel free to contribute or customize it for your business needs!
