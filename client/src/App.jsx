import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
    Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import Home from "./pages/Home/Home.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";

import InventoryList from "./pages/InventoryList/InventoryList.jsx";
import AddInventoryItem from "./pages/InventoryList/AddItem.jsx";
import UpdateInventoryItem from "./pages/InventoryList/UpdateItem.jsx";

import Orders from "./pages/Orders/Orders.jsx";
import AddOrder from "./pages/Orders/AddOrder.jsx";
import UpdateOrder from "./pages/Orders/UpdateOrder.jsx";

import Suppliers from "./pages/Suppliers/Suppliers.jsx";
import AddSupplier from "./pages/Suppliers/AddSupplier.jsx";
import UpdateSupplier from "./pages/Suppliers/UpdateSupplier.jsx";

import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import VerifyEmail from "./pages/VerifyEmail/VerifyEmail.jsx";
import Forgot_Password from "./pages/ForgotPassword/ForgotPassword.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import ChangePassword from "./pages/ChangePassword/ChangePassword.jsx";
import UserDetails from "./pages/UserDetails/UserDetails.jsx"

// Components
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";

// Styles
import "./App.css";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword.jsx";

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
            {/*  Toast Container should be placed here so it's always available */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />

            <Routes>
                {/* Redirect root to login */}
                <Route path="/" element={<Navigate to="/login" />} />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/forgot-password" element={<Forgot_Password />} />

                <Route
                    path="/dashboard"
                    element={<RouteWithLayout element={<Dashboard />} />}
                />
                <Route
                    path="/inventory_list"
                    element={<RouteWithLayout element={<InventoryList />} />}
                />
                <Route
                    path="/inventory_list/add-item"
                    element={<RouteWithLayout element={<AddInventoryItem />} />}
                />
                <Route
                    path="/inventory_list/update-item/:id?"
                    element={
                        <RouteWithLayout element={<UpdateInventoryItem />} />
                    }
                />
                <Route
                    path="/orders"
                    element={<RouteWithLayout element={<Orders />} />}
                />
                <Route
                    path="/orders/add-order"
                    element={<RouteWithLayout element={<AddOrder />} />}
                />
                <Route
                    path="/orders/update-order/:id?"
                    element={
                        <RouteWithLayout element={<UpdateOrder />} />
                    }
                />
                <Route
                    path="/suppliers"
                    element={<RouteWithLayout element={<Suppliers />} />}
                />
                <Route
                    path="/suppliers/add-supplier"
                    element={<RouteWithLayout element={<AddSupplier />} />}
                />
                <Route
                    path="/suppliers/update-supplier/:id?"
                    element={
                        <RouteWithLayout element={<UpdateSupplier />} />
                    }
                />
                <Route
                    path="/home"
                    element={<RouteWithLayout element={<Home />} />}
                />
                <Route
                    path="/profile"
                    element={<RouteWithLayout element={<Profile />} />}
                />
                <Route
                    path="/change-password"
                    element={<RouteWithLayout element={<ChangePassword />} />}
                />
                <Route
                    path="/admin"
                    element={<RouteWithLayout element={<UserDetails />} />}
                />
            </Routes>
        </Router>
    );
};

export default App;
