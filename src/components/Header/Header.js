import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Hapus token dan status autentikasi dari localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    // Arahkan pengguna ke halaman login
    navigate('/login');
  };

  return (
    <header className="bg-blue-500 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4 items-center">
          <h1 className="text-xl font-bold">Jasa Marga App</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="hover:bg-blue-700 px-3 py-2 rounded"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/master')}
                  className="hover:bg-blue-700 px-3 py-2 rounded"
                >
                  Master Data
                </button>
              </li>
            </ul>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 px-3 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
