import React from "react";
import { Doughnut } from "react-chartjs-2"; // Import Doughnut chart from Chart.js
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function SectorActivityChart({ data }) {
  // Calculate the total sum of the counts
  const totalCount = data.reduce((total, item) => total + item.count, 0);

  // Format data for the donut chart
  const chartData = {
    labels: data.map((item) => item.sector),
    datasets: [
      {
        label: "Sector Activity",
        data: data.map((item) => item.count),
        backgroundColor: ['#CC0000', '#0000CC', '#00CC00', '#CCCC00', '#D68A00', '#660066', '#00CCCC', '#DB6B93', '#DB3D6A', '#C73B00', '#7A1E7E'],
      }
    ]
  };

  // Chart options to disable the legend and modify the tooltip
  const options = {
    plugins: {
      legend: {
        display: false, // Disable the legend
      },
      tooltip: {
        callbacks: {
          // Modify the tooltip label to show the percentage of the total
          label: function(tooltipItem) {
            const percentage = ((tooltipItem.raw / totalCount) * 100).toFixed(2); // Calculate percentage
            return `${percentage}%`; // Return percentage with a '%' symbol
          }
        }
      }
    },
  };

  return (
    <div className="sector-activity-chart">
      <Doughnut data={chartData} options={options} />
    </div>
  );
}

export default SectorActivityChart;
