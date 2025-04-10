import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css'


const Home = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDarkMode(document.body.classList.contains('dark-mode'));
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    setDarkMode(document.body.classList.contains('dark-mode'));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="container-home">
      <div className={`home-container ${darkMode ? 'dark-bg-db' : 'light-bg-db'} animate-in`}>

        <h2 className={`mb-4 fw-bold text-center ${darkMode ? 'text-white' : 'text-dark'} animate-in`}>
          🍽️ Welcome to Restaurant Inventory Manager
        </h2>
        <p className={`lead text-center mb-5 ${darkMode ? 'text-white' : 'text-dark'} animate-in`}>
          Manage your inventory, suppliers, and orders seamlessly.
        </p>

        <div className="row justify-content-center animate-in">
          <div className="col-md-4 mb-4 animate-in">
            <div className={`card shadow-sm h-100 ${darkMode ? 'bg-dark text-light' : ''} card-animate`}>
              <div className="card-body text-center">
                <h5 className="card-title">📦 Inventory</h5>
                <p className="card-text">Track all your ingredients and stock levels.</p>
                <Link to="/inventory_list" className="btn btn-primary mt-2">View Inventory</Link>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4 animate-in">
            <div className={`card shadow-sm h-100 ${darkMode ? 'bg-dark text-light' : ''} card-animate`}>
              <div className="card-body text-center">
                <h5 className="card-title">🚚 Suppliers</h5>
                <p className="card-text">Keep track of your suppliers and their details.</p>
                <Link to="/suppliers" className="btn btn-success mt-2">Manage Suppliers</Link>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4 animate-in">
            <div className={`card shadow-sm h-100 ${darkMode ? 'bg-dark text-light' : ''} card-animate`}>
              <div className="card-body text-center">
                <h5 className="card-title">🧾 Orders</h5>
                <p className="card-text">View and manage purchase orders efficiently.</p>
                <Link to="/orders" className="btn btn-warning mt-2">Check Orders</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
