# Daftar - دفتر (Backend)

This is the backend of the **Daftar** Invoice Management System, built with Node.js, Express, and MongoDB.

## Features

- **Authentication & Authorization**
  - JWT-based login system
  - Role-based access control (`admin`, `seller`, `user`)
- **Invoice Management**
  - Create, update, delete, and fetch invoices
  - Tracks total amount, status, and related customer/products
- **Product Management**
  - Manage product catalog with pricing and stock
- **Customer Management**
  - Add, update, and delete customer records
- **Inventory Management**
  - Track stock increase/decrease
  - Inventory transaction logging
- **Reports**
  - Daily revenue
  - Monthly sales
  - Sales by product
  - Revenue by customer
  - Low stock products
  - Unpaid invoices
  - Inventory movement

## Technologies Used

- **Node.js**
- **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **dotenv** for environment variable management

## Setup Instructions

1. Clone the repository
2. Navigate to the backend folder:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file and configure:
   ```
   PORT=5000
   MONGO_URI=your_mongo_connection_string
   JWT_SECRET=your_jwt_secret
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

## Folder Structure

- `/models` – Mongoose schemas
- `/controllers` – Business logic
- `/routes` – API route definitions
- `/middlewares` – Auth and error middlewares

## License

MIT
