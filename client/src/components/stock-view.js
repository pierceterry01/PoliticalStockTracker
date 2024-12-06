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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Format number function
  const formatNumber = (number) => {
    if (number === undefined || number === null) {
      return "0";  
    }
  
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + "M";
    }
    if (number >= 1000) {
      return (number / 1000).toFixed(1) + "K";
    }
    return number.toFixed(2);
  };

  // Fetch the latest trade data and volume data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the latest trade dates
        const latestTradeResponse = await axios.get(
          "http://localhost:3001/api/latest-trade-data"
        );
        const latestTradeData = latestTradeResponse.data;

        // Create a map of politician names to their last traded date
        const tradeDateMap = latestTradeData.reduce((acc, item) => {
          acc[item.politicianName] = item.lastTraded;
          return acc;
        }, {});

        // Fetch total trade volume for each politician
        const updatedData = await Promise.all(
          stockData.map(async (politician) => {
            try {
              // Fetch trade volume data
              const response = await axios.get(
                "http://localhost:3001/api/trade-volume",
                { params: { politicianName: politician.politician } }
              );

              const totalTradeVolume = response.data.reduce(
                (total, item) => total + item.purchaseVolume + item.saleVolume,
                0
              );

              const changePercentResponse = await axios.get(
                "http://localhost:3001/api/change-dollar-percent",
                { params: { politicianName: politician.politician } }
              );
              

              const { changedollar = 0, percentage = 0, transactionType } = changePercentResponse.data;

              // Fetch position of the politician
              const positionResponse = await axios.get(
                "http://localhost:3001/api/politician-position",
                { params: { politicianName: politician.politician } }
              );
              let position = positionResponse.data.position;
              
              // Apply mapping for different position name
              // Apply mapping for different position names, ensuring lowercase comparisons
              if (position && position.toLowerCase() === "senator") {
                position = "Senate";
              } else if (position && position.toLowerCase() === "representative") {
                position = "House";
              } else {
                position = position ? position.charAt(0).toUpperCase() + position.slice(1) : "N/A";
              }

              return {
                ...politician,
                lastTraded: tradeDateMap[politician.politician] || politician.lastTraded,
                totalVolume: totalTradeVolume,
                changeDollar: changedollar,
                changePercent: percentage,
                transactionType,
                position,  
              };
            } catch (error) {
              console.error(
                `Error fetching data for ${politician.politician}:`,
                error
              );
              return {
                ...politician,
                lastTraded: tradeDateMap[politician.politician] || politician.lastTraded,
                totalVolume: 0,
                changeDollar: 0,
                changePercent: 0,
                transactionType: null,
                position: "N/A",  
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
    setCurrentPage(1); // Reset to first page after search
  };

  // Update filteredData and sort the displayData accordingly
  const getFilteredAndSortedData = () => {
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
        } else if (sortKey === "changeDollar") {
          res = a.changeDollar - b.changeDollar;
        } else if (sortKey === "changePercent") {
          res = a.changePercent - b.changePercent;
        } else {
          res = a[sortKey] - b[sortKey];
        }
        return sortDirection === "asc" ? res : -res;
      });
    }

    return filteredData;
  };

  const filteredData = getFilteredAndSortedData();

  // Page change logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const pageData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="stock-view-page">
      <div className="stock-view-content">
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
              <th>Position</th> 
              <th onClick={() => handleSort("changeDollar")}>Change $</th>
              <th onClick={() => handleSort("changePercent")}>Change %</th>
              <th onClick={() => handleSort("copiers")}>Copiers</th>
              <th onClick={() => handleSort("lastTraded")}>Last Traded</th>
              <th onClick={() => handleSort("totalVolume")}>Total Volume</th>
            </tr>
          </thead>
          <tbody>
            {pageData.length > 0 ? (
              pageData.map((row, index) => (
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
                  <td>
                    {row.position}
                  </td> 
                  <td>${formatNumber(row.changeDollar)}</td>
                  <td
                    className={`percent-change ${
                      row.transactionType === "Purchase" ||
                      row.transactionType === "buy" ||
                      row.transactionType === "Recieve"
                        ? "positive"
                        : row.transactionType === "Sale" ||
                          row.transactionType === "Sale (Partial)" ||
                          row.transactionType === "sell" ||
                          row.transactionType === "Sale (Full)" ||
                          row.transactionType === "Sell (PARTIAL)"
                        ? "negative"
                        : ""
                    }`}
                  >
                    {row.changePercent !== undefined ? `${row.changePercent}%` : "0"}
                  </td>

                  <td>{row.copiers}</td>
                  <td>
                    {row.lastTraded ? new Date(row.lastTraded).toLocaleDateString() : "N/A"}
                  </td>
                  <td>${formatNumber(row.totalVolume)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-results">
                  No politicians match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Page Change Control */}
        <div className="page-change-controls">
          <button
            className="page-button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`page-button ${currentPage === index + 1 ? "active" : ""}`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className="page-button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default StockViewPage;
