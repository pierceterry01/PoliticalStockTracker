import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

function SectorActivityChart({ data }) {
  const totalStocks = data.reduce((total, item) => total + item.count, 0);

  // chart data formatting
  const chartData = {
    labels: data.map((item) => item.sector), 
    datasets: [
      {
        label: "Sector Activity",
        data: data.map((item) => item.count), 
        backgroundColor: [
          "#893fe2",
          "#ec3aa6",
          "#fee131",
          "#12adf9",
          "#20f6c2",
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      
      legend: {
        display: true, 
        position: "top", 
        labels: {
          color: "white", 
          boxWidth: 15, 
          padding: 10, 
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const item = data[tooltipItem.dataIndex];
            const percentage = ((item.count / totalStocks) * 100).toFixed(2);
            return `${percentage}%`; 
          },
        },
      },
    },
  };

  return (
    <div className="sector-activity-chart" style={{ position: 'relative', width: '325px', height: '325x' }}>
      <h3 className="chart-header">Most Traded Sectors</h3>
      <Doughnut data={chartData} options={options} />
    </div>
  );
}

export default SectorActivityChart;
