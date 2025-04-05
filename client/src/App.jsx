import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import Sidebar from "./components/Navbar/Sidebar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import InventoryList from "./pages/InventoryList/InventoryList.jsx";
import Orders from "./pages/Orders/Orders.jsx";
import Suppliers from "./pages/Suppliers/Suppliers.jsx";

function App() {
  return (
    <Router>
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 d-flex flex-column min-vh-100">
          <main className="p-4 flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/inventory_list" element={<InventoryList />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/suppliers" element={<Suppliers />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
