import React, { useEffect, useState } from 'react';
import api from '../../api/api.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import './InventoryList.css';

const InventoryList = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [newItem, setNewItem] = useState({
    itemName: '',
    category: '',
    quantity: '',
    unit: '',
    threshold: ''
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
      console.log("Hi")
      const response = await api.get('api/v1/inventory/get-all-items');
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
    const { itemName, category, quantity, unit, threshold } = newItem;

    if (!itemName || !category || !quantity || !unit || !threshold) {
      alert('Please fill all fields');
      return;
    }

    try {
      console.log("Hi")
      await api.post('/api/v1/inventory/add-inventory-item', {
        itemName,
        category,
        quantity: Number(quantity),
        unit,
        threshold: Number(threshold)
      });
      console.log("Hi")
      setNewItem({ itemName: '', category: '', quantity: '', unit: '', threshold: '' });
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
                name="itemName"
                placeholder="e.g. Tomato"
                value={newItem.itemName}
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
              <label className="form-label fw-semibold">Threshold</label>
              <input
                type="number"
                className="form-control"
                name="threshold"
                placeholder="e.g. 10"
                value={newItem.threshold}
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
                  <th>Threshold</th>
                  <th>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.itemName}</td>
                    <td>{item.category}</td>
                    <td>{item.quantity}</td>
                    <td>{item.unit}</td>
                    <td>{item.threshold}</td>
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
