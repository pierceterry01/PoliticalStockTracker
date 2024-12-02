import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/PortfolioPage.css";
import "../styles/chartSectionPortfolio.css";
import SectorsAllocationsChart from "../charts/sectorAllocations.js";

function PortfolioPage() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPortfolioValue, setTotalPortfolioValue] = useState(900000); // Total value of the portfolio
  const [totalInvestments, setTotalInvestments] = useState(0); 
  const [followingCount, setFollowingCount] = useState(0); 
  const [averageInvestment, setAverageInvestment] = useState(0);
  const [investments, setInvestments] = useState([]); 
  const [aggregatedSectors, setAggregatedSectors] = useState([]); 

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

  // Get the number of politicians the user is following
  const fetchFollowingCount = () => {
    const followedPoliticians = JSON.parse(localStorage.getItem("investments")) || [];
    setFollowingCount(followedPoliticians.length);
  };

  // Function to get the total investments made by the user
  const calculateTotalInvestments = () => {
    const investmentsData = JSON.parse(localStorage.getItem("investments")) || [];
    setInvestments(investmentsData); 
    const total = investmentsData.reduce((sum, inv) => sum + (inv.investAmount || 0), 0);
    setTotalInvestments(total);
    
    // Calculate the average investment amount based on the total
    const average = investmentsData.length > 0 ? total / investmentsData.length : 0;
    setAverageInvestment(average); 
  
    localStorage.setItem("totalInvestment", total.toString());

    // Aggregate sector data here
    aggregateSectorAllocations(investmentsData);
  };

  // Function to aggregate sector allocations
  const aggregateSectorAllocations = (investmentsData) => {
    const sectorAggregates = {};

    investmentsData.forEach((investment) => {
      const { sectorAllocations } = investment;
      Object.keys(sectorAllocations).forEach((sector) => {
        const allocation = sectorAllocations[sector];
        sectorAggregates[sector] = (sectorAggregates[sector] || 0) + allocation;
      });
    });

    setAggregatedSectors(
      Object.entries(sectorAggregates).map(([sector, allocation]) => ({
        sector,
        allocation,
      }))
    );
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchAllTrades();
    fetchFollowingCount();
    calculateTotalInvestments();
  }, []);

  const formatNumber = (number) => {
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + "M";
    }
    if (number >= 1000) {
      return (number / 1000).toFixed(1) + "K";
    }
    return number.toFixed(2);
  };
  

  return (
     <div className="portfolio-page">
      <div className="portfolio-content">
        <aside className="sidebar">
          {/* Total Assets */}
          <div className="total-assets">
            <h2>Total Assets:</h2>
            <p className="assets-value">
              $ {totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          {/* Stock Returns */}
          <div className="sidebar-section">
            <h3>Stock Returns</h3>
            <ul className="stock-returns-list">
              <li>MSFT</li>
              <li>NVDA</li>
              <li>TSLA</li>
            </ul>
          </div>

          {/* Politician Returns */}
          <div className="sidebar-section">
            <h3>Politician Returns</h3>
            <ul className="politician-returns-list">
              <li>
                <img src="https://via.placeholder.com/40" alt="Politician 1" className="politician-photo" />
                <span>Politician 1</span>
              </li>
              <li>
                <img src="https://via.placeholder.com/40" alt="Politician 2" className="politician-photo" />
                <span>Politician 2</span>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main Area */}
        <main className="main-content">
        <div className="chart-section-portfolio">
          <div className="left-side-portfolio">
            {/* User Metrics Boxes */}
            <div className="metrics-portfolio">
              <h1 className="metrics-header">Portfolio Overview</h1>
              <div className="box following">
                Following:&nbsp;{followingCount}
              </div>
              <div className="box total-investments">
                Total Investments: ${formatNumber(totalInvestments)}
              </div>
              <div className="box average-investment-amount">
                Avg. Investment Amount: ${formatNumber(averageInvestment)}
              </div>
            </div>
          </div>

          <div className="right-side-portfolio">
            {/* Sector Allocations Chart */}
            <div className="SectorAllocationsChart">
              {aggregatedSectors.length > 0 && <SectorsAllocationsChart aggregatedSectors={aggregatedSectors} />}
            </div>
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
                      <td className={["buy", "purchase"].includes(trade.transactionType.toLowerCase()) ? "buy-type" : "sell-type"}>
                        {trade.transactionType}
                      </td>
                      <td>
                        ${trade.amountFrom.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} - 
                        ${trade.amountTo.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td>$0.00</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-data">No trades found.</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default PortfolioPage;
