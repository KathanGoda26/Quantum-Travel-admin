import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/SideBar';
import './dashboard.css'; // Add this line

const Dashboard = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;