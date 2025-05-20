import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaBars, FaRoute, FaCog, FaSignOutAlt } from 'react-icons/fa';
import './sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { path: 'manage-tours', icon: <FaRoute />, label: 'Manage Tours' },
    { path: 'settings', icon: <FaCog />, label: 'Settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="top-section">
        <button className="toggle-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>
        {isOpen && <h1 className="logo">Quantum Admin</h1>}
      </div>

      <nav className="nav-links">
        {menuItems.map(({ path, icon, label }) => (
          <NavLink 
            key={path} 
            to={path} 
            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
            title={label}
          >
            <div className="icon">{icon}</div>
            {isOpen && <span className="label">{label}</span>}
            {!isOpen && <span className="tooltip">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout Section */}
      <div className="logout-section">
        <button onClick={handleLogout} className="logout-btn" title="Logout">
          <div className="icon"><FaSignOutAlt /></div>
          {isOpen && <span className="label">Logout</span>}
          {!isOpen && <span className="tooltip">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;