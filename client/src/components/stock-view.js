import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/StockViewPage.css";
import stockData from "../data/stockData";

function StockViewPage() {
  const [displayData, setDisplayData] = useState(stockData);
  const [sortKey, setSortKey] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch the latest trade data and volume data
  useEffect(() => {
    const fetchData = async () => {
      try {
         const latestTradeResponse = await axios.get(
          "http://localhost:3001/api/latest-trade-data"
        );
        const latestTradeData = latestTradeResponse.data;

         const tradeDateMap = latestTradeData.reduce((acc, item) => {
          acc[item.politicianName] = item.lastTraded;
          return acc;
        }, {});

         const updatedData = await Promise.all(
          stockData.map(async (politician) => {
            try {
              const response = await axios.get(
                "http://localhost:3001/api/trade-volume",
                { params: { politicianName: politician.politician } }
              );

              // Calculate total trade volume
              const totalTradeVolume = response.data.reduce(
                (total, item) => total + item.purchaseVolume + item.saleVolume,
                0
              );

              return {
                ...politician,
                lastTraded: tradeDateMap[politician.politician] || politician.lastTraded,
                totalVolume: totalTradeVolume,  
              };
            } catch (error) {
              console.error(
                `Error fetching trade volume for ${politician.politician}:`,
                error
              );
              return {
                ...politician,
                lastTraded: tradeDateMap[politician.politician] || politician.lastTraded,
                totalVolume: 0,  
              };
            }
          })
        );

        // Set the display data with updated values
        setDisplayData(updatedData);
      } catch (error) {
        console.error("Error fetching latest trade data or trade volumes:", error);
      }
    };

    fetchData();
  }, []);  

  // Handle sorting based on column header clicked
  const handleSort = (key) => {
    let direction = "asc";
    if (sortKey === key && sortDirection === "asc") {
      direction = "desc";
    }
    setSortKey(key);
    setSortDirection(direction);
  };

  // Handle search input change
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };

  // Update filteredData and sort the displayData accordingly
  const getFilteredAndSortedData = () => {
    // Filter based on search query
    let filteredData = displayData.filter((item) =>
      item.politician.toLowerCase().includes(searchQuery)
    );

     if (sortKey) {
      filteredData.sort((a, b) => {
        let res;
        if (sortKey === "politician") {
          res = a.politician.localeCompare(b.politician);
        } else if (sortKey === "lastTraded") {
          res = new Date(a.lastTraded) - new Date(b.lastTraded);
        } else if (sortKey === "totalVolume") {
          res = a.totalVolume - b.totalVolume;
        } else {
          res = a[sortKey] - b[sortKey];
        }
        return sortDirection === "asc" ? res : -res;
      });
    }

    return filteredData;
  };

  const filteredData = getFilteredAndSortedData();

  return (
    <div className="stock-view-page">
      {/* Main Content Section */}
      <div className="stock-view-content">
        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search Politicians"
            className="custom-input"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        {/* Data Table */}
        <table className="stock-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("politician")}>Politician</th>
              <th onClick={() => handleSort("changeDollar")}>Change $</th>
              <th onClick={() => handleSort("changePercent")}>Change %</th>
              <th onClick={() => handleSort("copiers")}>Copiers</th>
              <th onClick={() => handleSort("lastTraded")}>Last Traded</th>
              <th onClick={() => handleSort("totalVolume")}>Total Volume</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row, index) => (
                <tr key={index}>
                  <td className="image-name-cell">
                    <div className="politician-info">
                      <img
                        src={row.imgSrc}
                        alt={row.politician}
                        className="politician-image"
                      />
                      <Link
                        to={`/politician/${encodeURIComponent(row.politician)}`}
                        className={`politician-name ${row.party.toLowerCase()}`}
                      >
                        {row.politician}
                      </Link>
                    </div>
                  </td>
                  <td>${row.changeDollar.toLocaleString()}</td>
                  <td
                    className={`percent-change ${
                      row.changePercent >= 0 ? "positive" : "negative"
                    }`}
                  >
                    {row.changePercent > 0 ? "+" : ""}
                    {row.changePercent}%
                  </td>
                  <td>{row.copiers}</td>
                  <td>
                    {row.lastTraded
                      ? new Date(row.lastTraded).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    {row.totalVolume !== undefined
                      ? row.totalVolume.toLocaleString()
                      : "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-results">
                  No politicians match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StockViewPage;
