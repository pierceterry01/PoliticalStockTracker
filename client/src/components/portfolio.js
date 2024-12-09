import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/PortfolioPage.css";
import "../styles/chartSectionPortfolio.css";
import SectorsAllocationsChart from "../charts/sectorAllocations.js";
import PortfolioCompositionChart from "../charts/portfolioComposition.js";
import sectorMapping from "../data/sectorMapping-client.js";

function PortfolioPage() {
  const [loading, setLoading] = useState(true);
  const [totalPortfolioValue, setTotalPortfolioValue] = useState(0);
  const [totalInvestments, setTotalInvestments] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [averageInvestment, setAverageInvestment] = useState(0);
  const [investments, setInvestments] = useState([]);
  const [aggregatedSectors, setAggregatedSectors] = useState([]);
  const [aggregatedComposition, setAggregatedComposition] = useState([]);
  const [stocksHeld, setStocksHeld] = useState([]); // State to hold stocks
  const [selectedSectors, setSelectedSectors] = useState([]); 

  // Function to fetch all stocks held by followed politicians dynamically
  const fetchStocksHeld = async () => {
    try {
      setLoading(true);

      const followedPoliticians = JSON.parse(localStorage.getItem("investments")) || [];

      // Get the names of followed politicians
      const politicians = Array.from(new Set(followedPoliticians.map((inv) => inv.politicianName)));
      if (politicians.length === 0) {
        setStocksHeld([]);
        setLoading(false);
        return;
      }

      // Construct the query string dynamically
      const politicianName = encodeURIComponent(politicians.join(","));
      const response = await axios.get(`http://localhost:3001/api/stocks-held?politicians=${politicianName}`);

      if (response.status === 200 && response.data) {
        const stocks = response.data;

        // Filter stocks by selected sectors
        const filteredStocks = stocks.filter((stock) => {
          const sector = sectorMapping[stock.symbol]; 
          return selectedSectors.length === 0 || selectedSectors.includes(sector);
        });

        setStocksHeld(filteredStocks);
        console.log("Filtered Stocks Held:", filteredStocks);
      } else {
        setStocksHeld([]);
      }
    } catch (error) {
      console.error("Error fetching stocks held:", error);
      setStocksHeld([]);
    } finally {
      setLoading(false);
    }
  };


  // Get the number of politicians the user is following
  const fetchFollowingCount = () => {
    const followedPoliticians =
      JSON.parse(localStorage.getItem("investments")) || [];
    setFollowingCount(followedPoliticians.length);
  };

  // Function to get the total investments made by the user
  const calculateTotalInvestments = useCallback(() => {
    const investmentsData =
      JSON.parse(localStorage.getItem("investments")) || [];
    console.log("Investments Data in calculateTotalInvestments:", investmentsData);

    setInvestments(investmentsData);
    const total = investmentsData.reduce(
      (sum, inv) => sum + (inv.investAmount || 0),
      0
    );
    setTotalInvestments(total);
    setTotalPortfolioValue(total);

    // Calculate the average investment amount based on the total
    const average =
      investmentsData.length > 0 ? total / investmentsData.length : 0;
    setAverageInvestment(average);

    localStorage.setItem("totalInvestment", total.toString());

    aggregateSectorAllocations(investmentsData);

    aggregatePortfolioComposition(investmentsData);
  }, []);

  // Function to aggregate sector allocations
  const aggregateSectorAllocations = (investmentsData) => {
    const sectorAggregates = {};

    investmentsData.forEach((investment) => {
      const { sectorAllocations } = investment;
      if (sectorAllocations) {
        Object.keys(sectorAllocations).forEach((sector) => {
          const allocation = sectorAllocations[sector];
          sectorAggregates[sector] =
            (sectorAggregates[sector] || 0) + allocation;
        });
      }
    });

    setAggregatedSectors(
      Object.entries(sectorAggregates).map(([sector, allocation]) => ({
        sector,
        allocation,
      }))
    );
  };

  const aggregatePortfolioComposition = (investmentsData) => {
    const composition = {};
    investmentsData.forEach((inv) => {
      if (inv.politicianName) {
        composition[inv.politicianName] =
          (composition[inv.politicianName] || 0) + inv.investAmount;
      }
    });
    const aggregated = Object.entries(composition).map(([name, value]) => ({
      symbol: name,
      count: value,
    }));
    console.log("Aggregated Composition Data:", aggregated);
    setAggregatedComposition(aggregated);
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchFollowingCount();
    calculateTotalInvestments();
    fetchStocksHeld(); 
  }, [calculateTotalInvestments]);

  useEffect(() => {
    console.log("Aggregated Composition Updated:", aggregatedComposition);
  }, [aggregatedComposition]);

  const formatNumber = (number) => {
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + "M";
    }
    if (number >= 1000) {
      return (number / 1000).toFixed(1) + "K";
    }
    return number.toFixed(2);
  };

  // Extract unique politicians from investments
  const uniquePoliticians = Array.from(
    new Set(investments.map((inv) => inv.politicianName))
  ).filter(Boolean);

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

          {/* Portfolio Stats styled as before in light grey boxes */}
          <div className="sidebar-section metrics-portfolio">
            <h3 className="metrics-header">Portfolio Stats</h3>
            <div className="box following">Following: {followingCount}</div>
            <div className="box total-investments">
              Total Investments: ${formatNumber(totalInvestments)}
            </div>
            <div className="box average-investment-amount">
              Avg. Investment: ${formatNumber(averageInvestment)}
            </div>
          </div>

          {/* Copied Politicians */}
          <div className="sidebar-section metrics-portfolio">
            <h3 className="metrics-header">Copied Politicians</h3>
            <ul className="politician-returns-list">
              {uniquePoliticians.length > 0 ? (
                uniquePoliticians.map((pol, idx) => (
                  <li key={idx} className="box politician-list-item">
                    <Link to={`/politician/${encodeURIComponent(pol)}`} className="politician-link">
                      {pol}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="box">No politicians followed.</li>
              )}
            </ul>
          </div>
        </aside>

        <main className="main-content">
          <div className="chart-section-portfolio">
            <div className="left-side-portfolio">
              {console.log("Rendering PortfolioCompositionChart with data:", aggregatedComposition)}
              {aggregatedComposition && aggregatedComposition.length > 0 ? (
                <PortfolioCompositionChart data={aggregatedComposition} />
              ) : (
                <p>No portfolio composition data available.</p>
              )}
            </div>

            <div className="right-side-portfolio">
              <div className="SectorAllocationsChart">
                {aggregatedSectors.length > 0 && (
                  <SectorsAllocationsChart
                    aggregatedSectors={aggregatedSectors}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Stocks Held by Politicians */}
          <div id="stocks">
            <h3>Stocks Copied From Politicians</h3>
            {loading ? (
              <div className="loading">Loading stocks...</div>
            ) : stocksHeld.length > 0 ? (
              <table id="stocksTable">
                <thead>
                  <tr>
                  <th>Name</th> 
                  <th>Stock Symbol</th>
                  <th>Asset Name</th>
                  <th>Sector</th>
                  </tr>
                </thead>
                <tbody>
                  {stocksHeld.map((stock, index) => {
                    const sector = sectorMapping[stock.symbol] || "N/A";
                    console.log("Rendering Stock:", stock); // Debugging log
                    return (
                      <tr key={index}>
                        <td>{stock.politicianName}</td> 
                        <td>{stock.symbol}</td>
                        <td>{stock.assetName}</td>
                        <td>{sector}</td> 
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="no-data">No stocks found.</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default PortfolioPage;
