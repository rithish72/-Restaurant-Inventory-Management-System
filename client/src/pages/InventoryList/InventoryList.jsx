import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './InventoryList.css';

const InventoryList = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    quantity: '',
    unit: '',
    price: '',
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDarkMode(document.body.classList.contains('dark-mode'));
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    setDarkMode(document.body.classList.contains('dark-mode'));

    return () => observer.disconnect();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await axios.get('/api/v1/inventory');
      setInventory(response.data.data || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleAddItem = async () => {
    const { name, category, quantity, unit, price } = newItem;

    if (!name || !category || !quantity || !unit || !price) {
      alert('Please fill all fields');
      return;
    }

    try {
      await axios.post('/api/v1/inventory', newItem);
      setNewItem({ name: '', category: '', quantity: '', unit: '', price: '' });
      fetchInventory();
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item');
    }
  };

  return (
    <div className="container-db">
      <div className={`dashboard-container ${darkMode ? 'dark-bg-db' : 'light-bg-db'} animate-in`}>
        <h2 className={`text-center mb-4 fw-bold ${darkMode ? 'text-white' : 'text-dark'} animate-in`}>
          📦 Inventory List
        </h2>

        {/* Add Inventory Section */}
        <div className={`card mb-5 p-4 ${darkMode ? 'dark-card-bg' : 'card-bg'} animate-in`}>
          <h5 className="mb-3 fw-semibold">➕ Add New Item</h5>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Item Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                placeholder="e.g. Tomato"
                value={newItem.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Category</label>
              <select
                className="form-select"
                name="category"
                value={newItem.category}
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
                placeholder="e.g. 5"
                value={newItem.quantity}
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
                value={newItem.unit}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">Price (₹)</label>
              <input
                type="number"
                className="form-control"
                name="price"
                placeholder="e.g. 100.00"
                value={newItem.price}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <button className="btn btn-success mt-4 w-100 fw-bold" onClick={handleAddItem}>
            ➕ Add Item
          </button>
        </div>

        {/* Inventory Table */}
        {loading ? (
          <div className="text-center">
            <div className={`spinner-border ${darkMode ? 'text-light' : ''}`} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : inventory.length === 0 ? (
          <div className="alert alert-warning text-center animate-in">No inventory items found.</div>
        ) : (
          <div className="table-responsive animate-in">
            <table className={`table table-bordered table-hover rounded-3 overflow-hidden ${darkMode ? 'table-dark text-light' : ''}`}>
              <thead className="table-primary">
                <tr>
                  <th>#</th>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                  <th>Price (₹)</th>
                  <th>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>{item.quantity}</td>
                    <td>{item.unit}</td>
                    <td>{item.price}</td>
                    <td>{new Date(item.updatedAt).toLocaleString()}</td>
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

export default InventoryList;
