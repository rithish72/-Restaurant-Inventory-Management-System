import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    itemsSupplied: ''
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDarkMode(document.body.classList.contains('dark-mode'));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    setDarkMode(document.body.classList.contains('dark-mode'));
    return () => observer.disconnect();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const { data } = await axios.get('/api/v1/suppliers/get-all-suppliers');
      setSuppliers(data?.data || []);
    } catch (error) {
      console.error('Error fetching suppliers:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSupplier((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSupplier = async () => {
    const { name, contactPerson, phone, email, address, itemsSupplied } = newSupplier;

    if (!name || !contactPerson || !phone || !email || !address || !itemsSupplied) {
      alert('Please fill all fields');
      return;
    }

    const requestData = {
      supplier: name,
      contactPerson,
      phoneNumber: phone,
      email,
      address,
      itemsSupplied
    };

    try {
      await axios.post('/api/v1/suppliers/add-supplier', requestData);
      setNewSupplier({
        name: '',
        contactPerson: '',
        phone: '',
        email: '',
        address: '',
        itemsSupplied: ''
      });
      fetchSuppliers(); // Refresh supplier list
    } catch (error) {
      console.error('Error adding supplier:', error);
      alert('Failed to add supplier');
    }
  };

  return (
    <div className="container-db">
      <div className={`dashboard-container ${darkMode ? 'dark-bg-db' : 'light-bg-db'} animate-in`}>
        <h2 className={`text-center mb-4 fw-bold ${darkMode ? 'text-white' : 'text-dark'} animate-in`}>
          🧾 Suppliers List
        </h2>

        {/* Add Supplier Section */}
        <div className={`card mb-5 p-3 ${darkMode ? 'dark-card-bg' : 'card-bg'} animate-in`}>
          <h5 className="mb-0">➕ Add New Supplier</h5>
          <div className="row g-3 mt-2">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                name="name"
                placeholder="Supplier Name"
                value={newSupplier.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                name="contactPerson"
                placeholder="Contact Person"
                value={newSupplier.contactPerson}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                name="phone"
                placeholder="Phone Number"
                value={newSupplier.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-6">
              <input
                type="email"
                className="form-control"
                name="email"
                placeholder="Email"
                value={newSupplier.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                name="address"
                placeholder="Address"
                value={newSupplier.address}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-12">
              <input
                type="text"
                className="form-control"
                name="itemsSupplied"
                placeholder="Items Supplied (comma separated)"
                value={newSupplier.itemsSupplied}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <button className="btn btn-success mt-3 w-100 fw-semibold" onClick={handleAddSupplier}>
            ➕ Add Supplier
          </button>
        </div>

        {/* Supplier Table Section */}
        <div className="text-center">
          {loading ? (
            <div className="text-center">
              <div className={`spinner-border ${darkMode ? 'text-light' : ''}`} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : suppliers.length === 0 ? (
            <div className="alert alert-warning text-center">No suppliers found.</div>
          ) : (
            <div className="table-responsive">
              <table className={`table table-bordered table-hover rounded-3 overflow-hidden ${darkMode ? 'table-dark text-light' : ''}`}>
                <thead className="table-primary">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Contact Person</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Items Supplied</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map((supplier, index) => (
                    <tr key={supplier._id}>
                      <td>{index + 1}</td>
                      <td>{supplier.name}</td>
                      <td>{supplier.contactPerson}</td>
                      <td>{supplier.phone}</td>
                      <td>{supplier.email}</td>
                      <td>{supplier.address}</td>
                      <td>{Array.isArray(supplier.itemsSupplied) ? supplier.itemsSupplied.join(', ') : supplier.itemsSupplied}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Suppliers;
