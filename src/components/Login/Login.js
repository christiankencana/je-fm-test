import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://127.0.0.1:8001/api/login', {
        username,
        password,
      });

      if (response.data.status) {
        // Simpan token ke localStorage
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/dashboard');
      } else {
        setError('Login failed: ' + response.data.message);
      }
    } catch (err) {
      setError('Login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="mb-2 p-2 border border-gray-300 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-2 p-2 border border-gray-300 rounded"
      />
      <button
        onClick={handleLogin}
        className={`bg-blue-500 text-white p-2 rounded ${loading ? 'opacity-50' : ''}`}
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </div>
  );
};

export default Login;
