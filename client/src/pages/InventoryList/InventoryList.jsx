import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './InventoryList.css'

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

  // Detect dark mode
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDarkMode(document.body.classList.contains('dark-mode'));
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    setDarkMode(document.body.classList.contains('dark-mode'));

    return () => observer.disconnect();
  }, []);

  // Fetch inventory list
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

  // Input change handler for new item
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  // Add new item handler
  const handleAddItem = async () => {
    if (!newItem.name || !newItem.category || !newItem.quantity || !newItem.unit || !newItem.price) {
      alert('Please fill all fields');
      return;
    }

    try {
      await axios.post('/api/v1/inventory', newItem);
      setNewItem({ name: '', category: '', quantity: '', unit: '', price: '' });
      fetchInventory(); // Refresh inventory list
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
        <div className={`card mb-5 p-3 ${darkMode ? 'dark-card-bg' : 'card-bg'} animate-in`}>
          <h5 className="mb-0">➕ Add New Item</h5>
          <div className="row g-3">
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                name="name"
                placeholder="Item Name"
                value={newItem.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                name="category"
                placeholder="Category"
                value={newItem.category}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                name="quantity"
                placeholder="Quantity"
                value={newItem.quantity}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-2">
              <input
                type="text"
                className="form-control"
                name="unit"
                placeholder="Unit"
                value={newItem.unit}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                name="price"
                placeholder="Price"
                value={newItem.price}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <button className="btn btn-success mt-3 w-100" onClick={handleAddItem}>Add Item</button>
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
