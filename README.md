# 🍽️ Foodistan – Food Ordering & Delivery Web App

**Foodistan** is a professional full-stack food ordering and delivery web application. It allows users to browse menus, place orders, and track their order status in real-time. Restaurants can manage their menus and update order progress, and admins can control listings.

> 🚀 Built with **React.js (Frontend)**, **Node.js + Express (Backend)**, and **MySQL (Database)**

---

## 🔥 Features

### 👨‍🍳 User Side

- User authentication (Login/Signup)
- Browse food menu
- Add items to cart and place orders
- Track order status in real time
- View past orders

### 🛠️ Admin/Restaurant Side

- Add/Edit/Delete food items
- Manage categories
- View and update orders
- Change order statuses (e.g., Placed → Cooking → Delivered)

---

## 🛠 Tech Stack

### 💻 Frontend

- React.js
- Axios
- React Router DOM
- CSS Modules / Tailwind CSS (if used)

### 🖥 Backend

- Node.js
- Express.js
- MySQL
- JWT (Authentication)
- bcrypt.js (Password Hashing)
- Multer (File Uploads)
- dotenv, helmet, cors

---

## 📁 Project Structure

```
foodistan/
├── client/                  # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.js
│   ├── package.json
│   └── README.md

├── server/                  # Node Backend
│   ├── public/images/       # Uploaded Images
│   ├── index.js
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── config/
│   └── package.json

├── food_delievery_db.sql    # MySQL Schema File
```

---

## ⚙️ Setup Instructions

### 1️⃣ Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=food_delivery_db
PORT=5000
JWT_SECRET=your_jwt_secret
```

Then run:

```bash
npm start or node ./index.js
```

Import `food_delievery_db.sql` into your MySQL database using phpMyAdmin or MySQL CLI.

---

### 2️⃣ Frontend Setup

```bash
cd client
npm install
npm start
```

---

## 🔒 Security

- User passwords are hashed with `bcrypt`
- JWT used for secure session management
- API routes protected with middleware
- Helmet and CORS implemented for best practices

---

## 📸 Screenshots (Optional)

> Add some UI screenshots like Homepage, Cart, Order Tracking, Admin Panel.

---

## ✅ Future Enhancements

- Payment gateway integration (e.g., Razorpay, Stripe)
- Email notifications (Nodemailer)
- User reviews and feedback system
- Admin dashboard with analytics

---

## 👨‍💻 Developer

**Asmi**  
📧 meetagjk@gmail.com  
🔗 GitHub: [https://github.com/Asmi1605](https://github.com/Asmi1605/)

---

## 🔗 GitHub Repository

👉 [https://github.com/Asmi1605/foodistan](https://github.com/Asmi1605/foodistan-fullstack)

---

## 📜 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT)
