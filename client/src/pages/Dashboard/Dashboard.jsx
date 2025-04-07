import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

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
      <div className={`dashboard-container ${darkMode ? "dark-bg-db" : "light-bg-db"} animate-in`}>
        <h2 className={`mb-4 fw-bold ${darkMode ? "text-white" : "text-dark"} animate-in`}>📊 Dashboard Overview</h2>

        <div className="row animate-in">
          <div className="col-md-4 animate-in">
            <div className="card text-white bg-success mb-3">
              <div className="card-body">
                <h5 className="card-title">Total Inventory Items</h5>
                <p className="card-text fs-2">{inventoryStats.totalItems}</p>
              </div>
            </div>
          </div>

          <div className="col-md-4 animate-in">
            <div className="card text-white bg-warning mb-3">
              <div className="card-body">
                <h5 className="card-title">Low Stock Items</h5>
                <p className="card-text fs-2">{inventoryStats.lowStockItems.length}</p>
              </div>
            </div>
          </div>

          <div className="col-md-4 animate-in">
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

        <div className="mt-4 animate-in">
          <h4 className={`fw-bold ${darkMode ? 'text-white' : 'text-dark'} animate-in`}>🚚 Top Suppliers</h4>
          <ul className="list-group animate-in">
            {inventoryStats.topSuppliers.map((supplier, idx) => (
              <li key={idx} className="list-group-item">
                {supplier.name} - {supplier.totalOrders} orders
              </li>
            ))}
          </ul>
        </div>

        <div className="row mt-5 md-0 pd-0 animate-in">
          <div className="col animate-in">
            <h5 className={darkMode ? 'text-white' : 'text-dark'}>📉 Low Stock Items</h5>
            <Bar
            data={{
              labels: inventoryStats.lowStockItems.map(item => item.name),
              datasets: [
                {
                  label: 'Quantity',
                  data: inventoryStats.lowStockItems.map(item => item.quantity),
                  backgroundColor: '#f39c12'
                }
              ]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { labels: { color: darkMode ? '#fff' : '#000' } },
                title: { display: false }
              },
              scales: {
                x: {
                  ticks: { color: darkMode ? '#fff' : '#000' },
                  grid: {
                    color: darkMode ? '#aaa' : '#ccc'
                  }
                },
                y: {
                  ticks: { color: darkMode ? '#fff' : '#000' },
                  grid: {
                    color: darkMode ? '#aaa' : '#ccc'
                  }
                }
              }
            }}
          />

          </div>
          <div className="col animate-in pir-chart">
            <h5 className={darkMode ? 'text-white' : 'text-dark'}>🥧 Top Suppliers</h5>
            <Pie
              data={{
                labels: inventoryStats.topSuppliers.map(s => s.name),
                datasets: [
                  {
                    label: 'Orders',
                    data: inventoryStats.topSuppliers.map(s => s.totalOrders),
                    backgroundColor: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
                  }
                ]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    labels: { color: darkMode ? '#fff' : '#000' }
                  },
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
