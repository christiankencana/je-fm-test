import React, { useState } from 'react';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('login');

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="App">
      {currentPage === 'login' && <Login navigateTo={navigateTo} />}
      {currentPage === 'dashboard' && <Dashboard navigateTo={navigateTo} />}
    </div>
  );
}

export default App;
