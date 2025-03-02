'use client';

import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip, Legend);

// Constants
const CONSTANTS = {
  HAIR_PER_WIG: 80,
  HAIR_COST_PER_KG: 7000,
  KNOTTING_TIME_PER_WIG: 5,
  KNOTTING_COST_PER_WIG: 1400,
  CHEMICAL_PER_5_WIGS: 500,
  CHEMICAL_COST_PER_KG: 2000,
  OFFICE_COST_PER_MONTH: 1100000
};

export default function Calculator() {
  const [numWigs, setNumWigs] = useState<number>(0);
  const [productionDays, setProductionDays] = useState<number>(0);
  const [calculations, setCalculations] = useState({
    totalHair: 0,
    totalChemical: 0,
    hairCost: 0,
    requiredWorkers: 0,
    knottingCost: 0,
    chemicalCost: 0,
    totalCostPerWig: 0,
    totalCost: 0
  });

  const formatCurrency = (amount: number) => {
    return `BDT ${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
  };

  const formatWeight = (grams: number) => {
    const kg = grams / 1000;
    return `${kg.toLocaleString('en-IN', { maximumFractionDigits: 2 })} kg`;
  };

  useEffect(() => {
    if (numWigs > 0 && productionDays > 0) {
      const totalHair = numWigs * CONSTANTS.HAIR_PER_WIG;
      const totalChemical = (numWigs * CONSTANTS.CHEMICAL_PER_5_WIGS) / 5;
      const hairCost = (totalHair / 1000) * CONSTANTS.HAIR_COST_PER_KG;
      const requiredWorkers = Math.ceil((numWigs * CONSTANTS.KNOTTING_TIME_PER_WIG) / productionDays);
      const knottingCost = numWigs * CONSTANTS.KNOTTING_COST_PER_WIG;
      const chemicalCost = (totalChemical / 1000) * CONSTANTS.CHEMICAL_COST_PER_KG;
      const totalCostPerWig = (hairCost + knottingCost + chemicalCost) / numWigs;
      const totalCost = hairCost + knottingCost + chemicalCost + CONSTANTS.OFFICE_COST_PER_MONTH;

      setCalculations({
        totalHair,
        totalChemical,
        hairCost,
        requiredWorkers,
        knottingCost,
        chemicalCost,
        totalCostPerWig,
        totalCost
      });
    }
  }, [numWigs, productionDays]);

  const chartData = {
    labels: ['Hair Cost', 'Knotting Cost', 'Chemical Cost', 'Fixed Monthly Cost'],
    datasets: [{
      data: [
        calculations.hairCost,
        calculations.knottingCost,
        calculations.chemicalCost,
        CONSTANTS.OFFICE_COST_PER_MONTH
      ],
      backgroundColor: [
        'rgb(59, 130, 246)',
        'rgb(16, 185, 129)',
        'rgb(249, 115, 22)',
        'rgb(99, 102, 241)'
      ],
      borderWidth: 2,
      borderColor: '#ffffff'
    }]
  };

  return (
    <div className="pb-20">
      <motion.h1 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent"
      >
        Production Cost Calculator
      </motion.h1>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="card mb-6"
      >
        <div className="input-group">
          <label htmlFor="numWigs">Number of Wigs:</label>
          <input
            type="number"
            id="numWigs"
            min="1"
            value={numWigs || ''}
            onChange={(e) => setNumWigs(parseInt(e.target.value) || 0)}
            placeholder="Enter number of wigs"
          />
        </div>
        <div className="input-group">
          <label htmlFor="productionDays">Production Days:</label>
          <input
            type="number"
            id="productionDays"
            min="1"
            value={productionDays || ''}
            onChange={(e) => setProductionDays(parseInt(e.target.value) || 0)}
            placeholder="Enter production days"
          />
        </div>
      </motion.div>

      {numWigs > 0 && productionDays > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Material Requirements</h2>
              <div className="result-item">
                <label className="flex items-center">
                  Total Hair Required
                  <InformationCircleIcon className="w-4 h-4 ml-1 text-gray-500" title="Each wig requires 80g of hair" />
                </label>
                <span>{formatWeight(calculations.totalHair)}</span>
              </div>
              <div className="result-item">
                <label className="flex items-center">
                  Total Chemical Required
                  <InformationCircleIcon className="w-4 h-4 ml-1 text-gray-500" title="Every 5 wigs need 500g of chemical" />
                </label>
                <span>{formatWeight(calculations.totalChemical)}</span>
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Production Requirements</h2>
              <div className="result-item">
                <label className="flex items-center">
                  Required Workers
                  <InformationCircleIcon className="w-4 h-4 ml-1 text-gray-500" title="Each wig takes 5 days to knot" />
                </label>
                <span>{calculations.requiredWorkers} workers</span>
              </div>
            </div>
          </div>

          <div className="card mb-6">
            <h2 className="text-lg font-semibold mb-4">Cost Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="result-item">
                <label className="flex items-center">
                  Hair Cost
                  <InformationCircleIcon className="w-4 h-4 ml-1 text-gray-500" title="Hair costs 7,000 BDT per kg" />
                </label>
                <span>{formatCurrency(calculations.hairCost)}</span>
              </div>
              <div className="result-item">
                <label className="flex items-center">
                  Knotting Cost
                  <InformationCircleIcon className="w-4 h-4 ml-1 text-gray-500" title="Each wig costs 1,400 BDT to knot" />
                </label>
                <span>{formatCurrency(calculations.knottingCost)}</span>
              </div>
              <div className="result-item">
                <label className="flex items-center">
                  Chemical Cost
                  <InformationCircleIcon className="w-4 h-4 ml-1 text-gray-500" title="Chemical costs 2,000 BDT per kg" />
                </label>
                <span>{formatCurrency(calculations.chemicalCost)}</span>
              </div>
              <div className="result-item">
                <label className="flex items-center">
                  Fixed Monthly Cost
                  <InformationCircleIcon className="w-4 h-4 ml-1 text-gray-500" title="Fixed office operating cost of 1,100,000 BDT per month" />
                </label>
                <span>{formatCurrency(CONSTANTS.OFFICE_COST_PER_MONTH)}</span>
              </div>
            </div>
          </div>

          <div className="card mb-6">
            <h2 className="text-lg font-semibold mb-4">Cost Distribution</h2>
            <div className="h-64 mb-4">
              <Doughnut data={chartData} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }} />
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="card bg-gradient-to-r from-blue-100 to-teal-100 border border-blue-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="result-item bg-white/50 backdrop-blur shadow-sm">
                <label className="text-gray-800 font-medium">Cost per Wig</label>
                <span className="text-blue-700 text-xl font-bold">{formatCurrency(calculations.totalCostPerWig)}</span>
              </div>
              <div className="result-item bg-white/50 backdrop-blur shadow-sm">
                <label className="text-gray-800 font-medium">Total Production Cost</label>
                <span className="text-blue-700 text-xl font-bold">{formatCurrency(calculations.totalCost)}</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
} 