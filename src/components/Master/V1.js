import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import Header from '../Header/Header';

const initialModalData = {
  id: '',
  ruas_name: '',
  unit_id: '',
  photo: null,
  file: null,
  long: '',
  km_awal: '',
  km_akhir: '',
  status: '', // Change to empty string for select option
};

const Master = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false); 

  const [modalData, setModalData] = useState(initialModalData);
  const [viewData, setViewData] = useState(initialModalData);
  
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
      const response = await axios.get('http://127.0.0.1:8000/api/unit', {
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

  const handleShowViewModal = (item) => {
    setViewData(item);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewData(initialModalData);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      for (const key in modalData) {
        formData.append(key, modalData[key]);
      }

      if (isEdit) {
        await axios.post(`http://127.0.0.1:8000/api/ruas/${modalData.id}?_method=PUT`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post('http://127.0.0.1:8000/api/ruas', formData, {
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
      await axios.delete(`http://127.0.0.1:8000/api/ruas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch (error) {
      console.error(error);
    }
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
              {/* <th className="border px-4 py-2">Photo</th>
              <th className="border px-4 py-2">File</th> */}
              <th className="border px-4 py-2">Longitude</th>
              <th className="border px-4 py-2">KM Awal</th>
              <th className="border px-4 py-2">KM Akhir</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.filter((item) => item.status === "1" && item.ruas_name.toLowerCase().includes(search.toLowerCase())).map((item) => (
              <tr key={item.id}>
                <td className="border px-4 py-2">{item.ruas_name}</td>
                <td className="border px-4 py-2">
                  {units.find((u) => u.id === item.unit_id)?.unit || 'N/A'}
                </td>
                {/* <td className="border px-4 py-2">{item.photo_url}</td>
                <td className="border px-4 py-2">{item.doc_url}</td> */}
                <td className="border px-4 py-2">{item.long}</td>
                <td className="border px-4 py-2">{item.km_awal}</td>
                <td className="border px-4 py-2">{item.km_akhir}</td>
                <td className="border px-4 py-2">{item.status ? 'Active' : 'Inactive'}</td>
                <td className="border px-4 py-2">
                  <button onClick={() => handleShowViewModal(item)} className="text-green-500 mr-2">
                    <FaEye />
                  </button>
                  <button onClick={() => handleShowModal(item)} className="text-blue-500 mr-2">
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
        <Modal
          modalData={modalData}
          setModalData={setModalData}
          handleCloseModal={handleCloseModal}
          handleSave={handleSave}
          units={units}
        />
      )}
      {showViewModal && (
        <ViewModal
          viewData={viewData}
          handleCloseViewModal={handleCloseViewModal}
          units={units}
        />
      )}
    </div>
  );
};

const Modal = ({ modalData, setModalData, handleCloseModal, handleSave, units }) => {
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setModalData((prevData) => ({ ...prevData, [name]: files[0] }));
    } else {
      setModalData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded w-full max-w-2xl"> {/* Ubah ukuran form menjadi lebih responsif */}
        <h2 className="text-xl mb-4">{modalData.id ? 'Edit Data' : 'Add New Data'}</h2>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Ruas Name" name="ruas_name" value={modalData.ruas_name} onChange={handleChange} />
          <SelectField label="Unit Kerja" name="unit_id" value={modalData.unit_id} options={units} onChange={handleChange} />
          <FileField label="Foto URL" name="photo" onChange={handleChange} />
          <FileField label="Doc URL" name="file" onChange={handleChange} />
          <InputField label="Longitude" name="long" value={modalData.long} onChange={handleChange} />
          <InputField label="KM Awal" name="km_awal" value={modalData.km_awal} onChange={handleChange} />
          <InputField label="KM Akhir" name="km_akhir" value={modalData.km_akhir} onChange={handleChange} />
          <SelectField
            label="Status"
            name="status"
            value={modalData.status}
            options={[
              { id: '1', unit: 'Active' },
              { id: '0', unit: 'Inactive' },
            ]}
            onChange={handleChange}
          />
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={handleCloseModal} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">
            Cancel
          </button>
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, name, value, onChange }) => (
  <div className="mb-4">
    <label className="block text-gray-700">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="p-2 border border-gray-300 rounded w-full"
    />
  </div>
);

const SelectField = ({ label, name, value, options, onChange }) => (
  <div className="mb-4">
    <label className="block text-gray-700">{label}</label>
    <select name={name} value={value} onChange={onChange} className="p-2 border border-gray-300 rounded w-full">
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.unit}
        </option>
      ))}
    </select>
  </div>
);

const FileField = ({ label, name, onChange }) => (
  <div className="mb-4">
    <label className="block text-gray-700">{label}</label>
    <input type="file" name={name} onChange={onChange} className="p-2 border border-gray-300 rounded w-full" />
  </div>
);

const ViewModal = ({ viewData, handleCloseViewModal, units }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-4 rounded w-full max-w-2xl">
      <h2 className="text-xl mb-4">View Data</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Ruas Name</label>
          <p>{viewData.ruas_name}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Unit Kerja</label>
          <p>{units.find((u) => u.id === viewData.unit_id)?.unit || 'N/A'}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Longitude</label>
          <p>{viewData.long}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">KM Awal</label>
          <p>{viewData.km_awal}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">KM Akhir</label>
          <p>{viewData.km_akhir}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
          <p>{viewData.status ? 'Active' : 'Inactive'}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Photo</label>
          {/* <p>{viewData.photo_url}</p> */}
          {viewData.photo_url && <img src={`${viewData.photo_url}`} alt="Ruas" className="h-24 w-48" />}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">File</label>
          {/* <p>{viewData.doc_url}</p> */}
          {viewData.doc_url && <a href={`${viewData.doc_url}`} download>Download File</a>}
        </div>
      </div>
      <div className="flex justify-end">
        <button onClick={handleCloseViewModal} className="bg-gray-500 text-white px-4 py-2 rounded">Close</button>
      </div>
    </div>
  </div>
);

export default Master;