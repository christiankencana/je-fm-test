import React from 'react';
import Header from '../Header/Header';

const Dashboard = ({ navigateTo }) => {
  return (
    <div>
      <Header />
      <div className="p-4">
        <h1>Dashboard</h1>
        <p>Welcome to the dashboard!</p>
        <button onClick={() => navigateTo('login')} className="bg-red-500 text-white p-2 rounded">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
