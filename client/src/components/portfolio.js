import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/PortfolioPage.css";

function PortfolioPage() {
  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "ascending" });
  const [loading, setLoading] = useState(true);

  // Function to fetch data from the backend API
  const fetchData = async () => {
    try {
      setLoading(true);
      // Replace the URL with your API endpoint
      const response = await axios.get("http://localhost:3001/api/portfolio");
      if (response.status === 200 && response.data) {
        setData(response.data);
        setSortedData(response.data);
      } else {
        setData([]);
        setSortedData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
      setSortedData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Sorting function
  const handleSort = (key) => {
    let direction = "ascending";
    if (
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }

    const sortedArray = [...sortedData].sort((a, b) => {
      if (key === "politician") {
        if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
        if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
        return 0;
      } else if (key === "lastTraded") {
        const dateA = new Date(a[key]);
        const dateB = new Date(b[key]);
        return direction === "ascending"
          ? dateA - dateB
          : dateB - dateA;
      } else {
        return direction === "ascending"
          ? b[key] - a[key]
          : a[key] - b[key];
      }
    });

    setSortedData(sortedArray);
    setSortConfig({ key, direction });
  };

  return (
    <div id="portfolioBody">
      <a href="/" className="back-button">
        Back to Home
      </a>
      <header id="portfolioHeader">
        <h1>Politicians' Stock Portfolio</h1>
      </header>

      {/* Trades Details Table */}
      <div id="trades">
        <h3>Portfolio Overview</h3>
        {loading ? (
          <div>Loading data...</div>
        ) : sortedData.length > 0 ? (
          <table id="tradesTable">
            <thead>
              <tr>
                <th onClick={() => handleSort("politician")}>Politician</th>
                <th onClick={() => handleSort("changeDollar")}>Change $</th>
                <th onClick={() => handleSort("changePercent")}>Change %</th>
                <th onClick={() => handleSort("copiers")}>Copiers</th>
                <th onClick={() => handleSort("lastTraded")}>Last Traded</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item, index) => (
                <tr key={index}>
                  <td>{item.politician}</td>
                  <td>
                    $
                    {item.changeDollar.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td
                    className={
                      item.changePercent >= 0 ? "positive" : "negative"
                    }
                  >
                    {item.changePercent.toFixed(2)}%
                  </td>
                  <td>{item.copiers}</td>
                  <td>{new Date(item.lastTraded).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>No data available.</div>
        )}
      </div>
    </div>
  );
}

export default PortfolioPage;
