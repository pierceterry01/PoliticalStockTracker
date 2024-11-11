import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import "../styles/PortfolioPage.css";

function PortfolioPage() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPortfolioValue, setTotalPortfolioValue] = useState(0); // Total value of the portfolio

  // Function to fetch trades for a symbol from the backend API
  const fetchTradesForSymbol = async (symbol, fromDate, toDate) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/congressional-trading`,
        {
          params: {
            symbol: symbol,
            from: fromDate,
            to: toDate,
          },
        }
      );

      // Check if response contains valid data
      if (response.status === 200 && response.data && response.data.data) {
        return response.data.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error(`Error fetching trades for ${symbol}:`, error);
      return [];
    }
  };

  // Function to fetch all trades for the politician within given time period
  const fetchTradesForPolitician = async () => {
    const fromDate = "2020-01-01";
    const toDate = "2024-12-31";

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

  // Fetch trades from Finnhub API and insert them into the database
  const fetchTradesForSymbols = async () => {
    try {
        setFetchingTrades(true);
        const response = await axios.get("http://localhost:3001/api/congressional-trading/symbols");
        console.log("Fetch all symbols trades response:", response.data);
        fetchAllTrades(); // Re-fetch all trades after insertion
    } catch (error) {
        console.error("Error fetching trades for symbols:", error);
    } finally {
        setFetchingTrades(false);
    }
};

  useEffect(() => {
    fetchAllTrades();
  }, []);

  return (
    <div id="portfolioBody">
      <a href="/" className="back-button">
        Back to Home
      </a>
      <header id="portfolioHeader">
        <h1>{politician}'s Stock Portfolio</h1>
      </header>

      {/* Portfolio summary */}
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
                  <td>${stock.estimatedTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>

                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>No stocks found for {politician}.</div>
        )}
      </div>

      {/* Display total portfolio value */}
      <div id="total-portfolio-value">
        <h2 style={{ color: "green" }}>
          Total Portfolio Value: ${totalPortfolioValue.toLocaleString()}
        </h2>
      </div>

      {/* Trades Details Table */}
      <div id="trades">
        <h3>All Trades </h3>
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
                  <td
                    className={
                      ["buy", "purchase"].includes(
                        trade.transactionType.toLowerCase()
                      )
                        ? "buy"
                        : "sell"
                    }
                  >
                    {trade.transactionType}{" "}
                    {/* This will apply the correct class to make transaction type either green or red */}
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
                    })}{" "}
                    {/* Display the range */}
                  </td>
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
