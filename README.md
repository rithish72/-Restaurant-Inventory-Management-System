# Restaurant Inventory Management System

## 🔖 Overview
A full-stack web application designed for restaurants to efficiently manage inventory, track food items, and monitor stock levels. Built using **React.js**, **Node.js**, **Express**, and **MongoDB**, it streamlines stock control and helps reduce wastage.

---

## ⚙️ Tech Stack
- **Frontend**: React.js
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Styling**: CSS

---

## 📂 Project Structure
```bash
Restaurant_Inventory_Management_System/
├── client/                         # React frontend
│   ├── public/
│   └── src/
│       ├── api/
│       │   └── api.js
│       ├── assets/                # Static assets
│       │   ├── bg-dark-mode.jpeg
│       │   ├── bg-light-mode.jpeg
│       │   └── logo.png
│       ├── components/            # UI components
│       │   ├── Footer/
│       │   │   ├── Footer.jsx
│       │   │   └── Footer.css
│       │   ├── NavBar/
│       │   │   ├── NavBar.jsx
│       │   │   └── NavBar.css
│       │   └── SideBar/
│       │       ├── SideBar.jsx
│       │       └── SideBar.css
│       ├── pages/                 # Application views
│       │   ├── Login/
│       │   │   ├── Login.jsx
│       │   │   └── Login.css
│       │   ├── Register/
│       │   │   ├── Register.jsx
│       │   │   └── Register.css
│       │   ├── ChangePassword/
│       │   │   └── ChangePassword.jsx
│       │   ├── ForgotPassword/
│       │   │   └── ForgotPassword.jsx
│       │   ├── Home/
│       │   │   ├── Home.jsx
│       │   │   └── Home.css
│       │   ├── Orders/
│       │   │   ├── AddOrders.jsx
│       │   │   ├── Orders.jsx
│       │   │   └── UpdateOrders.css
│       │   ├── InventoryList/
│       │   │   ├── AddInventory.jsx
│       │   │   ├── Inventory.jsx
│       │   │   ├── InventoryList.jsx
│       │   │   └── InventoryList.css
│       │   ├── Suppliers/
│       │   │   ├── AddSuppliers.jsx
│       │   │   ├── Suppliers.jsx
│       │   │   └── UpdateSuppliers.css
│       │   ├── Profile/
│       │   │   ├── Profile.jsx
│       │   │   └── Profile.css
│       │   ├── UserDetails/
│       │   │   ├── UserDetails.jsx
│       │   │   └── UserDetails.css
│       │   ├── Dashboard/
│       │   │   ├── Dashboard.jsx
│       │   │   └── Dashboard.css
│       │   └── VerifyEmail/
│       │       └── VerifyEmail.jsx
│       ├── App.jsx
│       ├── App.css
│       ├── App.test.jsx
│       ├── index.jsx
│       ├── reportWebVitals.jsx
│       └── setupTests.jsx
│
├── server/                         # Node backend
│   ├── public/
│   └── src/
│       ├── controller/
│       │   ├── admin.controller.js
│       │   ├── auth.controller.js
│       │   ├── dashboard.controller.js
│       │   ├── inventory.controller.js
│       │   ├── orders.controller.js
│       │   ├── supplier.controller.js
│       │   └── user.controller.js
│       ├── middleware/
│       │   ├── auth.middlewares.js
│       │   └── role.middlewares.js
│       ├── models/
│       │   ├── inventory.models.js
│       │   ├── orders.models.js
│       │   ├── supplier.models.js
│       │   └── user.models.js
│       ├── routes/
│       │   ├── admin.routes.js
│       │   ├── auth.routes.js
│       │   ├── dashboard.routes.js
│       │   ├── inventory.routes.js
│       │   ├── orders.routes.js
│       │   ├── supplier.routes.js
│       │   └── user.routes.js
│       ├── tests/
│       │   ├── auth.test.js
│       │   └── inventory.test.js
│       ├── utils/
│       │   ├── ApiError.js
│       │   ├── ApiResponse.js
│       │   └── asyncHandler.js
│       ├── server.js
│       ├── app.js
│       └── config/
│           ├── redis.js
│           └── db.js
│
├── .env
├── .gitignore
├── .prettierrc
├── .prettierignore
├── .hintrc
├── package.json
├── package-lock.json
├── README.md
└── .vscode/
```

---

## 🚀 Features
### Backend (Express API)
- `GET /api/v1/user/get-all-item` - Retrieve all items
- `GET /api/v1/user/get-current-item/:id` - Retrieve single item
- `POST /api/v1/user/update-item` - Add a new item
- `DELETE /api/v1/user/delete-item/:id` - Delete item

### Frontend (React)
- Display inventory, orders, supplier, dashboard, profile, admin panel(only for admin)
- Add/edit/delete item
- Password management (change password, forgot password)
- Authentication and verification

---

## 🧾 Database Schema
### Collection: `items`
| Field      | Type     | Description               |
|------------|----------|---------------------------|
| _id        | ObjectId | Unique ID                 |
| name       | String   | Inventory item name       |
| quantity   | Number   | Quantity in stock         |
| price      | Number   | Price per unit            |
| category   | String   | Item category (e.g., Meat)|
| expiry     | Date     | Expiration date           |

---

## 🛠️ Setup Instructions
### Requirements
- Node.js + npm
- MongoDB

### Installation
```bash
# Clone repo
$ git clone https://github.com/rithish72/Restaurant_Inventory_Management_System.git
$ cd Restaurant_Inventory_Management_System

# Backend setup
$ cd server
$ npm install
```
Create `.env`:
```
MONGO_URI=your_mongo_connection_string
```
Start backend:
```bash
$ npm start
```

```bash
# Frontend setup
$ cd ../client
$ npm install
$ npm start
```
App runs at: `http://localhost:3000`

---

## 🔧 API Example
```bash
curl http://localhost:5000/api/v1
```

---

## ✅ Evaluation Criteria
| Area         | Details                          |
|--------------|----------------------------------|
| Functionality| CRUD and basic auth              |
| UI/UX        | Responsive and intuitive         |
| Code Quality | Modular, reusable, readable code|
| Testing      | Manual via Postman or curl       |
| Docs         | Clear setup and usage info       |

---

## 🚫 Disqualification Criteria
- Broken or missing core features
- Poor code organization
- Missing documentation

---

## 🧩 Future Improvements
- Add JWT-based authentication
- Inventory alerts for low stock/expiry
- UI enhancement using Tailwind or MUI

---

## 👤 Author
[Rithish](https://github.com/rithish72)

> Crafted with a blend of food tech love 🍲 and clean coding 🧼
