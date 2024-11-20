import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation } from 'react-router-dom';
import "../styles/PortfolioPage.css";

function PortfolioPage() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingTrades, setFetchingTrades] = useState(false);
  const [stockSummary, setStockSummary] = useState([]);
  const [totalPortfolioValue, setTotalPortfolioValue] = useState(0);
  const location = useLocation();

  // Extract politician name from query parameters
  const query = new URLSearchParams(location.search);
  const politician = query.get('politicianName') || 'Nancy Pelosi'; // Default to Nancy Pelosi

  const fetchAllTrades = async () => {
    try {
      setFetchingTrades(true);
      const response = await axios.get('http://localhost:3001/api/trades/politician', {
        params: {
          politicianName: politician
        }
      });
      setTrades(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching trades for politician:", error);
      setLoading(false);
    } finally {
      setFetchingTrades(false);
    }
  };

  useEffect(() => {
    fetchAllTrades();
  }, [politician]);

  return (
    <div id="portfolioBody">
      <a href="/stock-view" className="back-button">
        Back to Home
      </a>
      <header id="portfolioHeader">
        <h1>{politician}'s Stock Portfolio</h1>
      </header>
      <div id="stock-summary">
        {loading ? (
          <div>Loading stock summary...</div>
        ) : stockSummary.length > 0 ? (
          <table id="stockSummaryTable">
            <thead>
              <tr>
                <th>Stock Symbol</th>
                <th>Estimated Total</th>
              </tr>
            </thead>
            <tbody>
              {stockSummary.map((stock, index) => (
                <tr key={index}>
                  <td>{stock.symbol}</td>
                  <td>${stock.estimatedTotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>No stocks found for {politician}.</div>
        )}
      </div>
      <div id="total-portfolio-value">
        <h2 style={{ color: "green" }}>
          Total Portfolio Value: ${totalPortfolioValue.toLocaleString()}
        </h2>
      </div>
      <div id="trades">
        <h3>All Trades for {politician}</h3>
        {loading ? (
          <div>Loading trades...</div>
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
                  <td>{trade.transactionType}</td>
                  <td>${trade.amountFrom} - ${trade.amountTo}</td>
                  <td>$0.00</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>No trades found for {politician}.</div>
        )}
      </div>
    </div>
  );
}

export default PortfolioPage;
