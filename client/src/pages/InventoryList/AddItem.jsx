import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import  './InventoryList.css';
import api from '../../api/api.js';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddItem = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [newItem, setNewItem] = useState({
    itemName: '',
    category: '',
    quantity: '',
    unit: '',
    threshold: '',
    _id: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDarkMode(document.body.classList.contains('dark-mode'));
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    setDarkMode(document.body.classList.contains('dark-mode'));

    return () => observer.disconnect();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleAddOrUpdateItem = async () => {
    const { itemName, category, quantity, unit, threshold, _id } = newItem;

    if (!itemName || !category || !quantity || !unit || !threshold) {
      alert('Please fill all fields');
      return;
    }

    try {
      if (_id) {
        await api.put(`/api/v1/inventory/update-inventory-item/${_id}`, {
          itemName,
          category,
          quantity: Number(quantity),
          unit,
          threshold: Number(threshold)
        });
      } else {
        await api.post('/api/v1/inventory/add-inventory-item', {
          itemName,
          category,
          quantity: Number(quantity),
          unit,
          threshold: Number(threshold)
        });
      }

      setNewItem({ itemName: '', category: '', quantity: '', unit: '', threshold: '', _id: '' });
      navigate('/inventory_list');
    } catch (error) {
      console.error(_id ? 'Error updating item:' : 'Error adding item:', error);
      alert(_id ? 'Failed to update item' : 'Failed to add item');
    }
  };

  return (
    <div>
        <div className="dashboard-container mt-4">
            <div className={`dashboard-container ${darkMode ? 'dark-bg-db' : 'light-bg-db'} animate-in`}>
                <h5 className="mb-3 fw-semibold animate-in">{newItem._id ? 'Edit Item' : 'Add New Item'}</h5>
                <div className="row g-3  animate-in">
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
            <div className='animate-in'>
              <button className="btn btn-success mt-4 w-100 fw-bold" onClick={handleAddOrUpdateItem}>
              {newItem._id ? '✅ Update Item' : '➕ Add Item'}
              </button>
            </div>
        </div>
        </div>
    </div>
  );
};

export default AddItem;
