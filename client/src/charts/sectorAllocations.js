import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const SectorAllocationsChart = ({ aggregatedSectors }) => {
  const filteredSectors = aggregatedSectors.filter((data) => data.allocation > 0);
  const totalAllocation = filteredSectors.reduce((total, data) => total + data.allocation, 0);

  const chartData = {
    labels: filteredSectors.map((data) => data.sector), 
    datasets: [
      {
        data: filteredSectors.map((data) => data.allocation),
        backgroundColor: [
          '#893fe2',
          '#ec3aa6',
          '#fee131',
          '#12adf9',
          '#20f6c2',
          '#f56c42', 
          '#3ded97', 
          '#fc6dfe', 
          '#36c8e3', 
          '#f4a142', 
          '#d6336c', 
          '#9a7bfe'  
        ],
        borderWidth: 0,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top', 
        labels: {
          color: "white",
          boxWidth: 15,
          padding: 10,
        },
    
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const item = filteredSectors[tooltipItem.dataIndex];
            const percentage = ((item.allocation / totalAllocation) * 100).toFixed(2);
            return `${item.sector}: ${percentage}%`; 
          }
        }
      },
      title: {
        display: true,
        text: 'Sector Allocations',
        color: "white",
        font: {
          size: 20
      },
      }
    }
  };

  return <Doughnut data={chartData} options={chartOptions} />;
};

export default SectorAllocationsChart;
