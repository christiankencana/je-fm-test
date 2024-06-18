import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import Header from '../Header/Header';

const initialModalData = {
  ruas_name: '',
  unit_id: '', // Changed to unit_id to match the controller
  photo: null, // Changed to photo to match the controller
  file: null, // Changed to file to match the controller
  long: '',
  km_awal: '',
  km_akhir: '',
  status: '', // Change to empty string for select option
};

const Master = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(initialModalData);
  const [units, setUnits] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetchData();
    fetchUnits();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8001/api/ruas', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(response.data.data || []); // Ensure data is an array
    } catch (error) {
      console.error(error);
      setData([]); // Fallback to an empty array
    }
  };

  const fetchUnits = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8001/api/unit', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUnits(response.data.data || []); // Ensure units is an array
    } catch (error) {
      console.error(error);
      setUnits([]); // Fallback to an empty array
    }
  };

  const handleSearch = (e) => setSearch(e.target.value);

  const handleShowModal = (item = initialModalData) => {
    setModalData(item);
    setIsEdit(!!item.id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalData(initialModalData);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      for (const key in modalData) {
        formData.append(key, modalData[key]);
      }

      if (isEdit) {
        await axios.put(`http://127.0.0.1:8001/api/ruas/${modalData.id}`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post('http://127.0.0.1:8001/api/ruas', formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        });
      }

      fetchData();
      handleCloseModal();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://127.0.0.1:8001/api/ruas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setModalData({
      ...modalData,
      [name]: files ? files[0] : value,
    });
  };

  return (
    <div>
      <Header />
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl">Master Data</h1>
          <button onClick={() => handleShowModal()} className="bg-blue-500 text-white px-4 py-2 rounded">
            Add New
          </button>
        </div>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={handleSearch}
          className="p-2 border border-gray-300 rounded mb-4 w-full"
        />
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="border px-4 py-2">Ruas Name</th>
              <th className="border px-4 py-2">Unit Kerja</th>
              <th className="border px-4 py-2">Longitude</th>
              <th className="border px-4 py-2">KM Awal</th>
              <th className="border px-4 py-2">KM Akhir</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.filter((item) => item.ruas_name.toLowerCase().includes(search.toLowerCase())).map((item) => (
              <tr key={item.id}>
                <td className="border px-4 py-2">{item.ruas_name}</td>
                <td className="border px-4 py-2">
                  {units.find((u) => u.id === item.unit_id)?.unit || 'N/A'}
                </td>
                <td className="border px-4 py-2">{item.long}</td>
                <td className="border px-4 py-2">{item.km_awal}</td>
                <td className="border px-4 py-2">{item.km_akhir}</td>
                <td className="border px-4 py-2">{item.status ? 'Active' : 'Inactive'}</td>
                <td className="border px-4 py-2 flex space-x-2">
                  <button onClick={() => handleShowModal(item)} className="text-blue-500">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-500">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded w-1/2">
            <h2 className="text-2xl mb-4">{isEdit ? 'Edit Ruas' : 'Add New Ruas'}</h2>
            <div className="mb-4">
              <label className="block mb-2">Ruas Name</label>
              <input
                type="text"
                name="ruas_name"
                value={modalData.ruas_name}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Unit Kerja</label>
              <select
                name="unit_id"
                value={modalData.unit_id}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded w-full"
              >
                <option value="">Select Unit</option>
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.unit}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Longitude</label>
              <input
                type="text"
                name="long"
                value={modalData.long}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">KM Awal</label>
              <input
                type="text"
                name="km_awal"
                value={modalData.km_awal}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">KM Akhir</label>
              <input
                type="text"
                name="km_akhir"
                value={modalData.km_akhir}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Status</label>
              <select
                name="status"
                value={modalData.status}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded w-full"
              >
                <option value="">Select Status</option>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Photo</label>
              <input
                type="file"
                name="photo"
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Document</label>
              <input
                type="file"
                name="file"
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div className="flex justify-end">
              <button onClick={handleCloseModal} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">
                Cancel
              </button>
              <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Master;
