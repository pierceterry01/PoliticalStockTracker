// src/components/PortfolioPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/PortfolioPage.css";

function PortfolioPage() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPortfolioValue, setTotalPortfolioValue] = useState(900000); // Total value of the portfolio ($900,000 should be replaced with USER ACCOUNT DATA)
  const [stockSummary, setStockSummary] = useState([]); // Placeholder for right now
  const [fetchingTrades, setFetchingTrades] = useState(false); // Also a Placeholder :)
  const politician = "John Doe"; // John Doe is my favorite Politician! We should definitely put him in office since he is a totally real politician and not just a placeholder value

  // Function to fetch all trades
  const fetchAllTrades = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3001/api/trades");
      if (response.status === 200 && response.data) {
        setTrades(response.data);
      } else {
        setTrades([]);
      }
    } catch (error) {
      console.error("Error fetching trades:", error);
      setTrades([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTrades();
  }, []);

  return (
    <div className="portfolio-page">
      <div className="portfolio-content">
        <aside className="sidebar">
          {/* Total Assets */}
          <div className="total-assets">
            <h2>Total Assets:</h2>
            <p className="assets-value">
              $
              {totalPortfolioValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          {/* Stock Returns */}
          <div className="sidebar-section">
            <h3>Stock Returns</h3>
            <ul className="stock-returns-list">
              <li>MSFT</li>
              <li>NVDA</li>
              <li>TSLA</li>
              {/* ONLY FOR DISPLAY PURPOSES ATM */}
            </ul>
          </div>

          {/* Politician Returns */}
          <div className="sidebar-section">
            <h3>Politician Returns</h3>
            <ul className="politician-returns-list">
              <li>
                <img
                  src="https://via.placeholder.com/40"
                  alt="Politician 1"
                  className="politician-photo"
                />
                <span>Politician 1</span>
              </li>
              <li>
                <img
                  src="https://via.placeholder.com/40"
                  alt="Politician 2"
                  className="politician-photo"
                />
                <span>Politician 2</span>
              </li>
              {/* THIS IS JUST FOR DISPLAY PURPOSES CURRENTLY, NEED TO IMPLEMENT ACTUAL FUNCTIONALITY */}
            </ul>
          </div>
        </aside>

        {/* Main Area */}
        <main className="main-content">
          {/* Placeholder for Graph/Visualization (PIERCE LOOK HERE!) */}
          <div className="graph-container">
            <div className="graph-placeholder">
              <p>Graph/Visualization Placeholder</p>
            </div>
          </div>
          {/* Trades Details Table */}
          <div id="trades">
            <h3>All Trades</h3>
            {loading ? (
              <div className="loading">Loading trades...</div>
            ) : trades.length > 0 ? (
              <table id="tradesTable">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Symbol</th>
                    <th>Asset Name</th>
                    <th>Type</th>
                    <th>Amount Range</th>
                    <th>Stock Price</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.map((trade, index) => (
                    <tr key={index}>
                      <td>{trade.transactionDate}</td>
                      <td>{trade.symbol}</td>
                      <td>{trade.assetName}</td>
                      <td
                        className={
                          ["buy", "purchase"].includes(
                            trade.transactionType.toLowerCase()
                          )
                            ? "buy-type"
                            : "sell-type"
                        }
                      >
                        {trade.transactionType}
                      </td>
                      <td>
                        $
                        {trade.amountFrom.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        - $
                        {trade.amountTo.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td>$0.00</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-data">No trades found for {politician}.</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default PortfolioPage;
