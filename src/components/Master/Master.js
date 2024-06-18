import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import Header from '../Header/Header';

const Master = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [units, setUnits] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetchData();
    fetchUnits();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8000/api/ruas', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data && Array.isArray(response.data)) {
        setData(response.data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error(error);
      setData([]);
    }
  };

  const fetchUnits = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8000/api/unit', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setUnits(response.data.data);
      } else {
        setUnits([]);
      }
    } catch (error) {
      console.error(error);
      setUnits([]);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleShowModal = (item) => {
    setModalData(item || {});
    setIsEdit(!!item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalData({});
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('ruas', modalData.ruas);
      formData.append('unit_kerja', modalData.unit_kerja);
      formData.append('foto', modalData.foto);
      formData.append('dokumen', modalData.dokumen);
      formData.append('panjang_km', modalData.panjang_km);
      formData.append('km_awal', modalData.km_awal);
      formData.append('km_akhir', modalData.km_akhir);
      formData.append('status', modalData.status);

      if (isEdit) {
        await axios.put(`http://127.0.0.1:8000/api/ruas/${modalData.id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await axios.post('http://127.0.0.1:8000/api/ruas', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
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
      await axios.delete(`http://127.0.0.1:8000/api/ruas/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Header />
      <div className="p-4">
        <h2>Master Data</h2>
        <div className="my-4">
          <button onClick={() => handleShowModal()} className="bg-blue-500 text-white px-4 py-2 rounded">
            Add New
          </button>
        </div>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={handleSearch}
          className="mb-4 p-2 border border-gray-300 rounded"
        />
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Ruas</th>
              <th className="py-2">Unit Kerja</th>
              <th className="py-2">Panjang KM</th>
              <th className="py-2">KM Awal</th>
              <th className="py-2">KM Akhir</th>
              <th className="py-2">Status</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) && data
              .flatMap((unit) => unit.ruas)
              .filter((item) =>
                item.ruas_name.toLowerCase().includes(search.toLowerCase())
              )
              .map((item) => (
                <tr key={item.id}>
                  <td className="border px-4 py-2">{item.ruas_name}</td>
                  <td className="border px-4 py-2">{units.find(u => u.id === item.unit_id)?.unit}</td>
                  <td className="border px-4 py-2">{item.long}</td>
                  <td className="border px-4 py-2">{item.km_awal}</td>
                  <td className="border px-4 py-2">{item.km_akhir}</td>
                  <td className="border px-4 py-2">{item.status ? 'Aktif' : 'Tidak Aktif'}</td>
                  <td className="border px-4 py-2 flex space-x-2">
                    <FaEye onClick={() => handleShowModal(item)} className="text-blue-500 cursor-pointer" />
                    <FaEdit onClick={() => handleShowModal(item)} className="text-yellow-500 cursor-pointer" />
                    <FaTrash onClick={() => handleDelete(item.id)} className="text-red-500 cursor-pointer" />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {/* Modal */}
        {showModal && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen">
              <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-2xl mb-4">{isEdit ? 'Edit Data' : 'Add New Data'}</h2>
                <div className="mb-4">
                  <label className="block mb-2">Ruas</label>
                  <input
                    type="text"
                    value={modalData.ruas_name || ''}
                    onChange={(e) => setModalData({ ...modalData, ruas_name: e.target.value })}
                    className="p-2 border border-gray-300 rounded w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Unit Kerja</label>
                  <select
                    value={modalData.unit_kerja || ''}
                    onChange={(e) => setModalData({ ...modalData, unit_kerja: e.target.value })}
                    className="p-2 border border-gray-300 rounded w-full"
                  >
                    <option value="">Select Unit Kerja</option>
                    {units.map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.unit}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Foto</label>
                  <input
                    type="file"
                    onChange={(e) => setModalData({ ...modalData, foto: e.target.files[0] })}
                    className="p-2 border border-gray-300 rounded w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Dokumen</label>
                  <input
                    type="file"
                    onChange={(e) => setModalData({ ...modalData, dokumen: e.target.files[0] })}
                    className="p-2 border border-gray-300 rounded w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Panjang KM</label>
                  <input
                    type="number"
                    value={modalData.panjang_km || ''}
                    onChange={(e) => setModalData({ ...modalData, panjang_km: e.target.value })}
                    className="p-2 border border-gray-300 rounded w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">KM Awal</label>
                  <input
                    type="text"
                    value={modalData.km_awal || ''}
                    onChange={(e) => setModalData({ ...modalData, km_awal: e.target.value })}
                    className="p-2 border border-gray-300 rounded w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">KM Akhir</label>
                  <input
                    type="text"
                    value={modalData.km_akhir || ''}
                    onChange={(e) => setModalData({ ...modalData, km_akhir: e.target.value })}
                    className="p-2 border border-gray-300 rounded w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Status</label>
                  <input
                    type="checkbox"
                    checked={modalData.status || false}
                    onChange={(e) => setModalData({ ...modalData, status: e.target.checked })}
                    className="p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="flex space-x-4">
                  <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
                    Save
                  </button>
                  <button onClick={handleCloseModal} className="bg-gray-500 text-white px-4 py-2 rounded">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Master;
