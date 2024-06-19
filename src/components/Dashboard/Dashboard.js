import Header from '../Header/Header';
import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

import DataTable from 'react-data-table-component';

import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [barData, setBarData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Long (km)',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  });

  const [pieData, setPieData] = useState({
    labels: [],
    datasets: [
      {
        label: '# of Units',
        data: [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  });

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  useEffect(() => {
    fetchBarData();
    fetchPieData();
  }, []);

  const fetchBarData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8000/api/ruas', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const data = response.data.data;

      const labels = data.map(item => item.ruas_name);
      const values = data.map(item => item.unit_id);

      setBarData({
        labels: labels,
        datasets: [
          {
            label: 'Long (km)',
            data: values,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      });

      console.log('Data fetched and set to state:', { labels, values });
    } catch (error) {
      console.error('Error fetching bar data:', error);
    }
  };

  const fetchPieData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8000/api/ruas', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data.data;

      const labels = data.map(item => item.ruas_name);
      const values = data.map(item => item.unit_id);

      setPieData({
        labels: labels,
        datasets: [
          {
            label: '# of Votes',
            data: values,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching pie data:', error);
    }
  };

/// Modal & Tabel
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

  const [data, setData] = useState([]);
  const [showPhotoModal, setShowPhotoModal] = useState(false); 
  const [showViewModal, setShowViewModal] = useState(false); 

  const [viewData, setViewData] = useState(initialModalData);
  const [units, setUnits] = useState([]);

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

  const handleShowPhotoModal = (item) => {
    setViewData(item);
    setShowPhotoModal(true);
  };

  const handleClosePhotoModal = () => {
    setShowPhotoModal(false);
    setViewData(initialModalData);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewData(initialModalData);
  };

  const columns = [
    {
      name: 'Ruas',
      selector: row => row.ruas_name,
      sortable: true,
    },
    {
      name: 'Lokasi',
      selector: row => row.km_awal + ' s/d ' + row.km_akhir,
      sortable: true,
    },
    {
      name: 'Photo',
      cell: row => (
        <div>
          <button onClick={() => handleShowPhotoModal(row)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full">
            Lihat
          </button>
        </div>
      ),
    },
    {
      name: 'Document',
      cell: row => (
        <div>
           {row.doc_url && <a className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full' href={`${row.doc_url}`} download>Download File</a>}
        </div>
      ),
    },
    {
      name: 'Unit Kerja',
      selector: row => units.find((u) => u.id === row.unit_id)?.unit || 'N/A',
      sortable: true,
    },
    {
      name: 'Status',
      selector: row => row.status === '0' ? 'Inactive' : 'Active',
      sortable: true,
    },
  ]

  return (
    <div>
      <Header />
      <div className="p-4">
        <h2 className='text-2xl font-bold'>Dashboard</h2>
        {/* Konten dashboard lainnya */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ width: '100%', height: '200px' }}>
            <Bar data={barData} options={barOptions} />
          </div>
          <div style={{ width: '100%', height: '200px' }}>
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
      </div>
      <div className="container mx-auto p-4">
        <DataTable
          columns={columns}
          data={data.filter(item => item.status === '1')} 
          pagination
          highlightOnHover
          pointerOnHover
        />
      </div>
      {showPhotoModal && (
        <PhotoModal
          viewData={viewData}
          handleClosePhotoModal={handleClosePhotoModal}
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

const PhotoModal = ({ viewData, handleClosePhotoModal }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-4 rounded w-full max-w-2xl">
      <h2 className="text-xl mb-4">Photo</h2>
      <img src={viewData.photo_url} alt="Modal" className="w-full mb-4" />
      <div className="flex justify-end">
        <button onClick={handleClosePhotoModal} className="bg-gray-500 text-white px-4 py-2 rounded">Close</button>
      </div>
    </div>
  </div>
)

const ViewModal = ({ viewData, handleCloseViewModal, units }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-4 rounded w-full max-w-2xl">
      <h2 className="text-xl mb-4">View Data</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Ruas</label>
          <p>{viewData.ruas_name}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Panjang (km)</label>
          <p>{viewData.long}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Unit Kerja</label>
          <p>{units.find((u) => u.id === viewData.unit_id)?.unit || 'N/A'}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">KM Awal</label>
          <p>{viewData.km_awal}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Photo</label>
          {viewData.photo_url && <img src={`${viewData.photo_url}`} alt="Ruas" className="h-24 w-48" />}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">KM Akhir</label>
          <p>{viewData.km_akhir}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">File</label>
          {viewData.doc_url && <a className='text-blue-500' href={`${viewData.doc_url}`} download>Download File</a>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
          <p>{viewData.status === '0' ? 'Inactive' : 'Active'}</p>
        </div>
      </div>
      <div className="flex justify-end">
      <button onClick={handleCloseViewModal} className="bg-gray-500 text-white px-4 py-2 rounded">Close</button>
      </div>
    </div>
  </div>
);

export default Dashboard;
