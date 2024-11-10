import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/styles.css";

function PortfolioPage() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingTrades, setFetchingTrades] = useState(false);

  // Fetch all trades from the backend
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
        <h1>Congressional Stock Trades</h1>
        <button onClick={fetchTradesForSymbols} disabled={fetchingTrades}>
          {fetchingTrades ? "Fetching Trades..." : "Fetch Trades"}
        </button>
      </header>

      <div id="trades">
        <h3>All Trades</h3>
        {loading ? (
          <div>Loading trades...</div>
        ) : trades.length > 0 ? (
          <table id="tradesTable">
            <thead>
              <tr>
                <th>Date</th>
                <th>Symbol</th>
                <th>Asset Name</th>
                <th>Transaction Type</th>
                <th>Amount From</th>
                <th>Amount To</th>
                <th>Politician Name</th>
                <th>Owner Type</th>
                <th>Position</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade, index) => (
                <tr key={index}>
                  <td>{trade.transactionDate}</td>
                  <td>{trade.symbol}</td>
                  <td>{trade.assetName || "N/A"}</td>
                  <td
                    className={
                      ["buy", "purchase"].includes(
                        trade.transactionType?.toLowerCase()
                      )
                        ? "buy"
                        : "sell"
                    }
                  >
                    {trade.transactionType}
                  </td>
                  <td>{trade.amountFrom?.toLocaleString() || "N/A"}</td>
                  <td>{trade.amountTo?.toLocaleString() || "N/A"}</td>
                  <td>{trade.politicianName || "N/A"}</td>
                  <td>{trade.ownerType || "N/A"}</td>
                  <td>{trade.position || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>No trades found.</div>
        )}
      </div>
    </div>
  );
}

export default PortfolioPage;
