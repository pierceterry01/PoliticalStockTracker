import React from "react";
import { Bar } from "react-chartjs-2";
import {Chart as ChartJS, Title, Tooltip, Legend, BarElement, LineElement, CategoryScale, LinearScale, PointElement} from "chart.js";

// Register necessary components for Chart.js
ChartJS.register(Title, Tooltip, Legend, BarElement, LineElement, CategoryScale, LinearScale, PointElement);

// Reformat number display to be K for thousands and M for millions
// Only effects the display
const NumberReformat = (number) => {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M';
  }
  if (number >= 1000) {
    return (number / 1000).toFixed(1) + 'K';
  }
  return number;
};

// Sorting the data display
// goes from q1 2021 to q4 2024, left to right on the x-axis
const TradeVolumeChart = ({ data }) => {
  const sortedData = data.sort((x, y) => {
    const [yearX, quarterX] = x.interval.split('-');
    const [yearY, quarterY] = y.interval.split('-');
    return yearX - yearY || quarterX - quarterY;
  });

  const quarters = sortedData.map((item) => item.interval);  

  const chartData = {
    labels: quarters, // Labels now in ascending order by year and quarter
    datasets: [
      {
        // Buy/Purchase Volume Bar
        label: "Buy Volume",
        data: sortedData.map((item) => item.purchaseVolume), 
        backgroundColor: "#40E0D0", 
        borderColor: "#40E0D0",     
        borderWidth: 2,             
        categoryPercentage: 1,    
        barPercentage: 0.5,         
      },
      {
        // Sell/Sale Volume Bar
        label: "Sell Volume",
        data: sortedData.map((item) => item.saleVolume), 
        backgroundColor: "#FFBF00", 
        borderColor: "#FFBF00",     
        borderWidth: 2,            
        categoryPercentage: 1,    
        barPercentage: 0.5,
      },
      {
        // Total Trades line chart
        label: "Trades",
        data: sortedData.map((item) => item.tradeCount), 
        borderColor: "#FF0249",     
        backgroundColor: "transparent", 
        borderWidth: 1,            
        fill: false,               
        tension: 0,                
        type: "line", 
        // point only present with intervals with number of trades above 0             
        pointRadius: sortedData.map((item) => (item.tradeCount === 0 ? 0 : 2)),
        pointBackgroundColor: "#FF4500", 
        yAxisID: "y2",             
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#333",
        titleColor: "#fff",
        bodyColor: "#fff",
        callbacks: {
          label: function (tooltipItem) {
            const value = tooltipItem.raw;
            const formattedValue = NumberReformat(value); 
            return `${tooltipItem.dataset.label}: ${formattedValue}`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: false,
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          color: "white",
        },
      },
      y: {
        type: "linear",
        position: "left",
        grid: {
          color: "grey",
        },
        ticks: {
          color: "white",
          // Apply the number reformat to y-axis display
          callback: function (value) {
            return NumberReformat(value); 
          },
        },
        title: {
          display: true,
          text: "Volume",
          color: "white",
        },
      },
      y2: {
        type: "linear",
        position: "right",
        // Hides the y2 axis so that the default y-axis numbers are only displayed
        display: false, 
      },
    },
  };

  return (
    <div className="trade-volume-chart" style={{ height: "700px", width: "825px" }}>
      <h3 className="chart-header">Trade Volume</h3>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default TradeVolumeChart;
