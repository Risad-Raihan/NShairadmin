'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { getShipmentData } from '@/services/sheets';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export default function ShipmentDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const shipmentData = await getShipmentData();
        setData(shipmentData);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load shipment data. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 text-center">
          <p className="text-xl font-semibold mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const productDistributionData = {
    labels: Object.keys(data.productDistribution),
    datasets: [{
      data: Object.values(data.productDistribution),
      backgroundColor: [
        'rgb(59, 130, 246)',
        'rgb(16, 185, 129)',
        'rgb(249, 115, 22)',
        'rgb(99, 102, 241)',
        'rgb(236, 72, 153)'
      ],
      borderWidth: 2,
      borderColor: '#ffffff'
    }]
  };

  const monthlyShipmentsData = {
    labels: Object.keys(data.monthlyShipments),
    datasets: [{
      label: 'Monthly Shipments',
      data: Object.values(data.monthlyShipments),
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 1
    }]
  };

  return (
    <div className="pb-20">
      <motion.h1 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent"
      >
        Shipment Analytics Dashboard
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card bg-gradient-to-br from-blue-50 to-blue-100"
        >
          <h2 className="text-xl font-semibold mb-2">Total Shipments</h2>
          <p className="text-3xl font-bold text-blue-600">{data.totalShipments}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card bg-gradient-to-br from-purple-50 to-purple-100"
        >
          <h2 className="text-xl font-semibold mb-2">Total Products Shipped</h2>
          <p className="text-3xl font-bold text-purple-600">{data.totalProducts}</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card"
        >
          <h2 className="text-xl font-semibold mb-4">Product Distribution</h2>
          <div className="h-64">
            <Doughnut 
              data={productDistributionData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      boxWidth: 12
                    }
                  }
                }
              }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="card"
        >
          <h2 className="text-xl font-semibold mb-4">Monthly Shipments</h2>
          <div className="h-64">
            <Bar 
              data={monthlyShipmentsData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  }
                }
              }}
            />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="card"
      >
        <h2 className="text-xl font-semibold mb-4">Top Buyers</h2>
        <div className="space-y-4">
          {data.topBuyers.map((buyer: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-800">{buyer.name}</span>
              <span className="text-blue-600 font-semibold">{buyer.orders} orders</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
} 