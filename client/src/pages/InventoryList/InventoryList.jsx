import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './InventoryList.css';

const InventoryList = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const navigate = useNavigate();

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

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await api.delete(`/api/v1/inventory/delete-inventory-item/${itemId}`);
      fetchInventory();
    } catch (error) {
      console.error("Failed to delete item:", error);
      alert("Failed to delete item");
    }
  };

  return (
    <div className="container-db">
      <div className={`dashboard-container ${darkMode ? 'dark-bg-db' : 'light-bg-db'} animate-in`}>
        <h2 className={`text-center mb-4 fw-bold ${darkMode ? 'text-white' : 'text-dark'}`}>
          Inventory List
        </h2>

        <div className="text-end mb-3">
          <button
            className="btn fw-semibold"
            style={{ backgroundColor: '#fd7e14', color: 'white' }}
            onClick={() => navigate('/inventory_list/add-item')}
          >
            Add Item
          </button>
        </div>

        {loading ? (
          <div className="text-center">
            <div className={`spinner-border ${darkMode ? 'text-light' : ''}`} role="status" />
          </div>
        ) : inventory.length === 0 ? (
          <div className="alert alert-warning text-center animate-in">
            No inventory items found.
          </div>
        ) : (
          <div className="table-responsive animate-in">
            <table className={`table table-bordered table-hover ${darkMode ? 'table-dark text-light' : ''}`}>
              <thead className={`${darkMode ? 'table-tertiary':'table-primary'}`}>
                <tr>
                  <th>#</th>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                  <th>Threshold</th>
                  <th>Last Updated</th>
                  <th>Actions</th>
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
                    <td className="d-flex flex-wrap gap-2">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => navigate(`/inventory_list/update-item/${item._id}`)}
                      >
                        Update
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteItem(item._id)}
                      >
                        Delete
                      </button>
                    </td>
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
