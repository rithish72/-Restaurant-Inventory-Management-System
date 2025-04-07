import React, {useState} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (credentials.email === "rithish@admin.com" && credentials.password === "rithish@03") {
      navigate("/home");
    } else {
      alert("Invalid credentials!");
    }
  };
  return (
    <div className="login-page d-flex align-items-center justify-content-center">
      <div className="login-card card p-4 shadow-lg animate-in">
        <h2 className="text-center mb-4 animate-in">Welcome Back</h2>
        <form className='animate-in' onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              className="form-control"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              className="form-control"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="btn-login btn w-100">Login</button>
        </form>
        <div className="text-center mt-3 animate-in">
          <small>
            Not registered?{' '}
            <NavLink to="/register" className="link-register">Create an account</NavLink>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;
