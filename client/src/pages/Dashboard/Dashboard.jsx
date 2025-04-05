import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [inventoryStats, setInventoryStats] = useState({
    totalItems: 0,
    lowStockItems: [],
    recentOrders: [],
    topSuppliers: []
  });

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/dashboard')
      .then(res => {
        setInventoryStats(res.data);
      })
      .catch(err => console.error(err));

    const observer = new MutationObserver(() => {
      setDarkMode(document.body.classList.contains('dark-mode'));
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    setDarkMode(document.body.classList.contains('dark-mode'));

    return () => observer.disconnect();
  }, []);

  return (
    <div className={`container-d ${darkMode ? "dark-bg" : "light-bg"}`}>
      <div className={`dashboard-container ${darkMode ? "dark-bg-db" : "light-bg-db"}`}>
        <h2 className={`mb-4 fw-bold ${darkMode ? "text-white" : "text-dark"}`}>📊 Dashboard Overview</h2>

        <div className="row">
          <div className="col-md-4">
            <div className="card text-white bg-success mb-3">
              <div className="card-body">
                <h5 className="card-title">Total Inventory Items</h5>
                <p className="card-text fs-2">{inventoryStats.totalItems}</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card text-white bg-warning mb-3">
              <div className="card-body">
                <h5 className="card-title">Low Stock Items</h5>
                <p className="card-text fs-2">{inventoryStats.lowStockItems.length}</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card text-white bg-info mb-3">
              <div className="card-body">
                <h5 className="card-title">Recent Orders</h5>
                <ul className="list-group list-group-flush">
                  {inventoryStats.recentOrders.map((order, idx) => (
                    <li key={idx} className="list-group-item">
                      {order.name} - {order.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h4 className={`fw-bold ${darkMode ? 'text-white' : 'text-dark'}`}>🚚 Top Suppliers</h4>
          <ul className="list-group">
            {inventoryStats.topSuppliers.map((supplier, idx) => (
              <li key={idx} className="list-group-item">
                {supplier.name} - {supplier.totalOrders} orders
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
