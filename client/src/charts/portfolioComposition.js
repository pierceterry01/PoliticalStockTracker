import React from "react";
import { Pie } from "react-chartjs-2"; 
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function PortfolioCompositionChart({ data }) {
  const totalStocks = data.reduce((total, item) => total + item.count, 0);

  // chart data formatting
  const chartData = {
    labels: data.map((item) => item.symbol), 
    datasets: [
      {
        label: "Portfolio Composition",
        data: data.map((item) => item.count), 
        backgroundColor: [
          "#893fe2",
          "#ec3aa6",
          "#fee131",
          "#12adf9",
          "#20f6c2",
        ],
        borderWidth: 0,
      }
    ]
  };
  const options = {
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
          label: function(tooltipItem) {
            const percentage = ((tooltipItem.raw / totalStocks) * 100).toFixed(2); 
            return `${percentage}%`; 
          }
        }
      }
    },
  };

  return (
    <div className="portfolio-composition-chart" style={{position: 'relative', width: '300px', height: '300px' }}>
      <h3 className="chart-header">Most Traded Issuers</h3>
      <Pie data={chartData} options={options} /> 
    </div>
  );
}

export default PortfolioCompositionChart;