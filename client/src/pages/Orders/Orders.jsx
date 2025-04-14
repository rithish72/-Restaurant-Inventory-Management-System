import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [newOrder, setNewOrder] = useState({
    orderNumber: '',
    items: '',
    supplier: '',
    status: '',
    deliveryDate: '',
    notes: ''
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDarkMode(document.body.classList.contains('dark-mode'));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    setDarkMode(document.body.classList.contains('dark-mode'));
    return () => observer.disconnect();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/v1/orders/get-all-orders');
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
    setNewOrder((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrder = async () => {
    const { orderNumber, items, supplier, status, deliveryDate, notes } = newOrder;
    if (!orderNumber || !items || !supplier || !status || !deliveryDate || !notes) {
      return alert('Please fill in all fields');
    }

    try {
      await axios.post('/api/v1/orders/add-orders', newOrder);
      setNewOrder({ orderNumber: '', items: '', supplier: '', status: '', deliveryDate: '', notes: '' });
      fetchOrders();
    } catch (error) {
      console.error('Error adding order:', error);
      alert('Failed to add order');
    }
  };

  return (
    <div className="container-db">
      <div className={`dashboard-container ${darkMode ? 'dark-bg-db' : 'light-bg-db'} animate-in`}>
        <h2 className={`text-center mb-4 fw-bold ${darkMode ? 'text-white' : 'text-dark'} animate-in`}>
          📋 Orders List
        </h2>

        {/* Add New Order */}
        <div className={`card mb-5 p-4 ${darkMode ? 'dark-card-bg' : 'card-bg'} animate-in`}>
          <h5 className="mb-3 fw-semibold">➕ Add New Order</h5>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label fw-semibold">Order Number</label>
              <input
                type="text"
                className="form-control"
                name="orderNumber"
                placeholder="e.g. ORD-1001"
                value={newOrder.orderNumber}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">Items (comma separated)</label>
              <input
                type="text"
                className="form-control"
                name="items"
                placeholder="e.g. Tomato, Milk"
                value={newOrder.items}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">Supplier</label>
              <input
                type="text"
                className="form-control"
                name="supplier"
                placeholder="e.g. FreshFarms"
                value={newOrder.supplier}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">Status</label>
              <select className="form-select" name="status" value={newOrder.status} onChange={handleInputChange}>
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">Delivery Date</label>
              <input
                type="date"
                className="form-control"
                name="deliveryDate"
                value={newOrder.deliveryDate}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">Notes</label>
              <textarea
                className="form-control"
                name="notes"
                rows="1"
                placeholder="Additional notes"
                value={newOrder.notes || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <button className="btn btn-success mt-4 w-100 fw-bold" onClick={handleAddOrder}>
            ➕ Add Order
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
                  <th>Items</th>
                  <th>Status</th>
                  <th>Delivery Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={order._id}>
                    <td>{index + 1}</td>
                    <td>{order.orderNumber}</td>
                    <td>{order.supplier}</td>
                    <td>{Array.isArray(order.items) ? order.items.join(', ') : order.items}</td>
                    <td>
                      <span className={`badge px-3 py-2 rounded-pill fw-medium ${
                        order.status === 'Pending' ? 'bg-warning text-dark'
                        : order.status === 'Cancelled' ? 'bg-danger'
                        : 'bg-success'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.deliveryDate).toLocaleDateString()}</td>
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
