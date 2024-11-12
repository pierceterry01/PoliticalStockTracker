import React from "react";
import { Pie } from "react-chartjs-2"; 
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function PortfolioCompositionChart({ data }) {
  // Calculate the total number of stocks in the portfolio
  const totalStocks = data.reduce((total, item) => total + item.count, 0);

  // Format data for the pie chart
  const chartData = {
    labels: data.map((item) => item.symbol), 
    datasets: [
      {
        label: "Portfolio Composition",
        data: data.map((item) => item.count), 
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#66FF66",
          "#FF6666",
          "#FF33FF",
          "#FFFF33",
        ],
      }
    ]
  };

  // Chart options to disable the legend and modify the tooltip
  const options = {
    plugins: {
      legend: {
        display: false, 
      },
      tooltip: {
        callbacks: {
          // Modify the tooltip label to show the percentage of the total
          label: function(tooltipItem) {
            const percentage = ((tooltipItem.raw / totalStocks) * 100).toFixed(2); // Calculate percentage
            return `${percentage}%`; 
          }
        }
      }
    },
  };

  return (
    <div className="portfolio-composition-chart">
      <Pie data={chartData} options={options} /> 
    </div>
  );
}

export default PortfolioCompositionChart;
