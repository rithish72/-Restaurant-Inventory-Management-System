import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [newOrder, setNewOrder] = useState({
    name: '',
    category: '',
    quantity: '',
    unit: '',
    price: '',
  });

  // Dark mode observer
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDarkMode(document.body.classList.contains('dark-mode'));
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    setDarkMode(document.body.classList.contains('dark-mode'));

    return () => observer.disconnect();
  }, []);

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/v1/orders');
      setOrders(response.data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrder({ ...newOrder, [name]: value });
  };

  const handleAddOrder = async () => {
    const { name, category, quantity, unit, price } = newOrder;

    if (!name || !category || !quantity || !unit || !price) {
      alert('Please fill all fields');
      return;
    }

    try {
      await axios.post('/api/v1/order', newOrder);
      setNewOrder({ name: '', category: '', quantity: '', unit: '', price: '' });
      fetchOrders();
    } catch (error) {
      console.error('Error adding Order:', error);
      alert('Failed to add item');
    }
  };

  return (
    <div className="container-db">
      <div className={`dashboard-container ${darkMode ? 'dark-bg-db' : 'light-bg-db'} animate-in`}>
        <h2 className={`text-center mb-4 fw-bold ${darkMode ? 'text-white' : 'text-dark'} animate-in`}>
          📋 Orders List
        </h2>

        {/* Add Item Section */}
        <div className={`card mb-5 p-4 ${darkMode ? 'dark-card-bg' : 'card-bg'} animate-in`}>
          <h5 className="mb-3 fw-semibold">➕ Add New Order</h5>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Item Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                placeholder="e.g. Tomato"
                value={newOrder.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Category</label>
              <select
                className="form-select"
                name="category"
                value={newOrder.category}
                onChange={handleInputChange}
              >
                <option value="">Select Category</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Dairy">Dairy</option>
                <option value="Meat">Meat</option>
                <option value="Beverages">Beverages</option>
                <option value="Bakery">Bakery</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">Quantity</label>
              <input
                type="number"
                className="form-control"
                name="quantity"
                min="1"
                step="1"
                placeholder="e.g. 5"
                value={newOrder.quantity}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">Unit</label>
              <input
                type="text"
                className="form-control"
                name="unit"
                placeholder="e.g. kg, L, pcs"
                value={newOrder.unit}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">Price (₹)</label>
              <input
                type="number"
                className="form-control"
                name="price"
                min="0"
                step="0.01"
                placeholder="e.g. 100.00"
                value={newOrder.price}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <button className="btn btn-success mt-4 w-100 fw-bold" onClick={handleAddOrder}>
            ➕ Add Item
          </button>
        </div>

        {/* Orders Table */}
        {loading ? (
          <div className="text-center animate-in">
            <div className={`spinner-border ${darkMode ? 'text-light' : ''}`} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="alert alert-info text-center animate-in">No orders found.</div>
        ) : (
          <div className="table-responsive animate-in">
            <table className={`table table-bordered table-hover rounded-3 overflow-hidden ${darkMode ? 'table-dark text-light' : ''}`}>
              <thead className={darkMode ? 'thead-light' : 'table-dark'}>
                <tr>
                  <th>#</th>
                  <th>Order ID</th>
                  <th>Supplier</th>
                  <th>Total Items</th>
                  <th>Status</th>
                  <th>Order Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={order._id}>
                    <td>{index + 1}</td>
                    <td>{order.orderNumber || order._id}</td>
                    <td>{order.supplier?.name || 'N/A'}</td>
                    <td>{order.items?.length || 0}</td>
                    <td>
                      <span
                        className={`badge px-3 py-2 rounded-pill fw-medium ${
                          order.status === 'Pending'
                            ? 'bg-warning text-dark'
                            : order.status === 'Cancelled'
                            ? 'bg-danger'
                            : 'bg-success'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
