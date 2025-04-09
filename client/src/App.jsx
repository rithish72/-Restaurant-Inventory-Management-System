import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

// Pages
import Home from "./pages/Home/Home.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import InventoryList from "./pages/InventoryList/InventoryList.jsx";
import Orders from "./pages/Orders/Orders.jsx";
import Suppliers from "./pages/Suppliers/Suppliers.jsx";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";

// Components
import Sidebar from "./components/Navbar/Sidebar.jsx";
import Footer from "./components/Footer/Footer.jsx";

//background image
import "./App.css";

// Layout wrapper component
const Layout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="d-flex">
      {/* Sidebar only if not on login or register page */}
      {!isAuthPage && (
        <aside className="flex-shrink-0 sidebar">
          <Sidebar />
        </aside>
      )}

      <div className="d-flex flex-column flex-grow-1 min-vh-100">
        <main className="flex-grow-1">{children}</main>

        {/* Footer only if not on login or register page */}
        {!isAuthPage && <Footer />}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventory_list" element={<InventoryList />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
