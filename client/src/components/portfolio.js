import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/styles.css";
import SectorActivityChart from "../charts/sectorActivity"; // Import the sector chart

function PortfolioPage() {
  const [trades, setTrades] = useState([]); // State for trades
  const [sectorData, setSectorData] = useState([]); // State for sector data
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

  // Fetch Sector Activity data from the backend
  const fetchSectorActivity = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/sector-activity");
      if (response.status === 200 && response.data) {
        setSectorData(response.data.sectorData); // Update sector data state
      }
    } catch (error) {
      console.error("Error fetching sector activity data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTrades();
    fetchSectorActivity(); // Fetch sector activity when component mounts
  }, []);

  return (
    <>
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

        {/* Displaying Trades */}
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
                      className={["buy", "purchase"].includes(
                        trade.transactionType?.toLowerCase()
                      )
                        ? "buy"
                        : "sell"}
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

        {/* Displaying Sector Activity */}
        <div id="sectorActivity">
          <h3>Sector Activity</h3>
          {sectorData.length > 0 ? (
            <SectorActivityChart data={sectorData} /> // Donut Chart for sector activity
          ) : (
            <p>No sector activity data available.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default PortfolioPage;
