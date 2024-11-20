// stock-view.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import '../styles/StockViewPage.css';
import stockData from '../data/stockData'; // Import stockData from a separate file

function StockViewPage() {
  const [displayData, setDisplayData] = useState(stockData);
  const [sortKey, setSortKey] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');

    // Handle sorting based on the column header clicked
    const handleSort = (key) => {
        const sorted = [...sortedData].sort(sortBy[key]);
        setSortKey(key);
        setSortedData(sorted);
    };

  return (
    <div className="stock-view-page">
      {/* Main Content Section */}
      <div className="stock-view-content">
        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search Politicians"
            className="search-input"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        {/* Data Table */}
        <table className="stock-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('politician')}>Politician</th>
              <th onClick={() => handleSort('changeDollar')}>Change $</th>
              <th onClick={() => handleSort('changePercent')}>Change %</th>
              <th onClick={() => handleSort('copiers')}>Copiers</th>
              <th onClick={() => handleSort('lastTraded')}>Last Traded</th>
            </tr>
          </thead>
          <tbody>
            {/* Mapping over displayData to render each row */}
            {displayData.length > 0 ? (
              displayData.map((row, index) => (
                <tr key={index}>
                  <td>
                    <img
                      src={row.imgSrc}
                      alt={row.politician}
                      className="politician-image"
                    />
                    {/* Wrap the politician's name with Link */}
                    <Link
                      to={`/politician/${encodeURIComponent(row.politician)}`}
                      className={`politician-name ${row.party.toLowerCase()}`}
                    >
                      {row.politician}
                    </Link>
                  </td>
                  <td>${row.changeDollar.toLocaleString()}</td>
                  <td
                    className={`percent-change ${
                      row.changePercent >= 0 ? 'positive' : 'negative'
                    }`}
                  >
                    {row.changePercent > 0 ? '+' : ''}
                    {row.changePercent}%
                  </td>
                  <td>{row.copiers}</td>
                  <td>{new Date(row.lastTraded).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-results">
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
