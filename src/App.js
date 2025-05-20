import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import ManageTours from './pages/ManageTours';
import Settings from './pages/Settings';

function App() {
  const isAuthenticated = localStorage.getItem('adminToken');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        {isAuthenticated && (
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="manage-tours" element={<ManageTours />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;