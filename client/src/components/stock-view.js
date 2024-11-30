import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/StockViewPage.css';
import stockData from '../data/stockData';

function StockViewPage() {
  const [displayData, setDisplayData] = useState(stockData);
  const [sortKey, setSortKey] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');

  // Seperated into different pages for better display
  // User can shift between pages of politicians
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Calculate page data
  const pageData = displayData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(displayData.length / itemsPerPage);

  // Handle sorting based on column header clicked
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortKey === key && sortDirection === 'asc') {
      direction = 'desc';
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

  // Update displayData when stockData, searchQuery, sortKey, or sortDirection changes
  useEffect(() => {
    let filteredData = stockData.filter((item) =>
      item.politician.toLowerCase().includes(searchQuery)
    );

    if (sortKey) {
      filteredData.sort((a, b) => {
        let res;
        if (sortKey === 'politician') {
          res = a.politician.localeCompare(b.politician);
        } else if (sortKey === 'lastTraded') {
          res = new Date(a.lastTraded) - new Date(b.lastTraded);
        } else {
          res = a[sortKey] - b[sortKey];
        }
        return sortDirection === 'asc' ? res : -res;
      });
    }

    setDisplayData(filteredData);
  }, [searchQuery, sortKey, sortDirection]);

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
              <th onClick={() => handleSort('politician')}>Politician</th>
              <th onClick={() => handleSort('changeDollar')}>Change $</th>
              <th onClick={() => handleSort('changePercent')}>Change %</th>
              <th onClick={() => handleSort('copiers')}>Copiers</th>
              <th onClick={() => handleSort('lastTraded')}>Last Traded</th>
            </tr>
          </thead>
          <tbody>
            {/* Render the data on different pages */}
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
              className={`page-button ${
                currentPage === index + 1 ? 'active' : ''
              }`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className="page-button"
            // Set previous button to disabled when on first page
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
