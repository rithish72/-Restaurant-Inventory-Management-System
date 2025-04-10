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
import Profile from "./pages/Profile/Profile.jsx";

// Components
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";

// Styles
import "./App.css";

// Layout component for authenticated pages
const MainLayout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="d-flex flex-grow-1">
        <aside className="flex-shrink-0 sidebar">
          <Sidebar />
        </aside>
        <div className="d-flex flex-column flex-grow-1">
          <main className="flex-grow-1">{children}</main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

// Layout handler to conditionally wrap routes
const RouteWithLayout = ({ element }) => {
  const location = useLocation();
  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  return isAuthPage ? element : <MainLayout>{element}</MainLayout>;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth pages (no layout) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* App pages (with layout) */}
        <Route path="/dashboard" element={<RouteWithLayout element={<Dashboard />} />} />
        <Route path="/inventory_list" element={<RouteWithLayout element={<InventoryList />} />} />
        <Route path="/orders" element={<RouteWithLayout element={<Orders />} />} />
        <Route path="/suppliers" element={<RouteWithLayout element={<Suppliers />} />} />
        <Route path="/home" element={<RouteWithLayout element={<Home />} />} />
        <Route path="/profile" element={<RouteWithLayout element={<Profile />} />} />
      </Routes>
    </Router>
  );
};

export default App;
