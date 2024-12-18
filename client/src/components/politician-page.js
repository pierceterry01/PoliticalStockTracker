import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import stockData from "../data/stockData";
import "../styles/PoliticianPage.css";
import "../styles/chartSectionPolitician.css";
import PortfolioCompositionChart from "../charts/portfolioComposition.js";
import SectorActivityChart from "../charts/sectorActivity.js";
import TradeVolumeChart from "../charts/tradeVolume.js";

// Import the CopyInvestorBox component
import CopyInvestorBox from "./CopyInvestorBox";

function PoliticianPage() {
  const { politicianName } = useParams();
  const decodedName = decodeURIComponent(politicianName);
  const navigate = useNavigate();

  const politicianData = stockData.find((p) => p.politician === decodedName);

  // States for charts
  const [portfolioCompData, setPortfolioCompData] = useState([]);
  const [sectorActivityData, setSectorActivityData] = useState([]);
  const [tradeVolumeData, setTradeVolumeData] = useState([]);

  // States for loading
  const [loadingPortfolioData, setLoadingPortfolioData] = useState(true);
  const [loadingSectorData, setLoadingSectorData] = useState(true);
  const [loadingVolumeData, setLoadingVolumeData] = useState(true);

  // State for trade and issuer counts
  const [tradeCount, setTradeCount] = useState(null);
  const [issuerCount, setIssuerCount] = useState(null);

  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/stocks", {
          params: { politicianName: decodedName },
        });
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoadingTransactions(false);
      }
    };
    fetchTransactions();
  }, [decodedName]);
  
  // Fetch updated transactions with missing asset names filled in
  useEffect(() => {
    const fetchUpdatedTransactions = async () => {
      try {
        console.log("Fetching updated transactions for:", decodedName);
        const response = await axios.get(
          "http://localhost:3001/api/updated-stocks",
          {
            params: { politicianName: decodedName },
          }
        );
        if (Array.isArray(response.data) && response.data.length > 0) {
          setTransactions(response.data);
        } else {
          console.warn("No transactions found for:", decodedName);
        }
      } catch (error) {
        console.error("Error fetching updated transactions:", error);
      } finally {
        setLoadingTransactions(false);
      }
    };

    fetchUpdatedTransactions();
  }, [decodedName]);

  useEffect(() => {
    const fetchMetrics = async () => {
      const tradeCountResponse = await axios.get(
        "http://localhost:3001/api/trade-count",
        { params: { politicianName: decodedName } }
      );
      const issuerCountResponse = await axios.get(
        "http://localhost:3001/api/issuer-count",
        { params: { politicianName: decodedName } }
      );
      setTradeCount(tradeCountResponse.data.tradeCount);
      setIssuerCount(issuerCountResponse.data.issuerCount);
    };
    fetchMetrics();
  }, [decodedName]);

  // Fetch trade volume data
  useEffect(() => {
    const fetchTradeVolumeData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/trade-volume",
          {
            params: { politicianName: decodedName },
          }
        );
        setTradeVolumeData(response.data);
      } catch (error) {
        console.error("Error fetching trade volume data:", error);
      } finally {
        setLoadingVolumeData(false);
      }
    };

    fetchTradeVolumeData();
  }, [decodedName]);

  // Fetch sector activity data
  useEffect(() => {
    const fetchSectorData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/sector-activity",
          {
            params: { politicianName: decodedName },
          }
        );
        setSectorActivityData(response.data.sectorData);
      } catch (error) {
        console.error("Error fetching sector activity data:", error);
      } finally {
        setLoadingSectorData(false);
      }
    };

    fetchSectorData();
  }, [decodedName]);

  // Fetch portfolio composition data
  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/portfolio-composition",
          {
            params: { politicianName: decodedName },
          }
        );

        setPortfolioCompData(response.data);
      } catch (error) {
        console.error("Error fetching portfolio composition data:", error);
      } finally {
        setLoadingPortfolioData(false);
      }
    };

    fetchPortfolioData();
  }, [decodedName]);

  // Calculate total trade volume
  const totalTradeVolume = tradeVolumeData.reduce(
    (total, item) => total + item.purchaseVolume + item.saleVolume,
    0
  );

  useEffect(() => {
    if (politicianData && totalTradeVolume) {
      const updatedData = {
        ...politicianData,
        totalVolume: totalTradeVolume,
      };
      localStorage.setItem(
        politicianData.politician,
        JSON.stringify(updatedData)
      );
    }
  }, [politicianData, totalTradeVolume]);

  // Calculate average quarterly trade volume
  const averageQuarterlyVolume =
    tradeVolumeData.length > 0 ? totalTradeVolume / tradeVolumeData.length : 0;

  const formatNumber = (number) => {
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + "M";
    }
    if (number >= 1000) {
      return (number / 1000).toFixed(1) + "K";
    }
    return number.toFixed(2);
  };

  // State for the follow button
  const [isFollowing, setIsFollowing] = useState(false);
  const [showCopyInvestorBox, setShowCopyInvestorBox] = useState(false);

  const handleFollowClick = () => {
    if (!isFollowing) {
      setShowCopyInvestorBox(true);
    } else {
      setIsFollowing(false);
      // Remove from localStorage if unfollowing
      const investments = JSON.parse(localStorage.getItem("investments")) || [];
      const updatedInvestments = investments.filter(
        (inv) => inv.politicianName !== politicianData.politician
      );
      localStorage.setItem("investments", JSON.stringify(updatedInvestments));
    }
  };

  const handleCloseCopyInvestorBox = () => {
    setShowCopyInvestorBox(false);
  };

  const handleInvest = (investmentData) => {
    setIsFollowing(true);
    setShowCopyInvestorBox(false);

    const politicianInvestment = {
      politicianName: politicianData.politician,
      imgSrc: politicianData.imgSrc,
      party: politicianData.party,
      sectors: investmentData.sectors,
      investAmount: investmentData.investAmount,
      sectorAllocations: investmentData.sectorAllocations,
      stopLossAmount: investmentData.stopLossAmount,
    };

    // Get existing investments from localStorage
    let existingInvestments =
      JSON.parse(localStorage.getItem("investments")) || [];

    // Check if politician already followed
    const isAlreadyInvested = existingInvestments.some(
      (inv) => inv.politicianName === politicianInvestment.politicianName
    );

    if (!isAlreadyInvested) {
      // Add new investment
      existingInvestments.push(politicianInvestment);
    } else {
      // Update existing investment
      existingInvestments = existingInvestments.map((inv) =>
        inv.politicianName === politicianInvestment.politicianName
          ? politicianInvestment
          : inv
      );
    }

    // Save updated investments to localStorage
    localStorage.setItem("investments", JSON.stringify(existingInvestments));

    navigate("/following");
  };

  if (!politicianData) {
    return (
      <div className="politician-page">
        <div className="politician-content">
          <h1>Politician not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="politician-page">
      {/* Main Content */}
      <div className="politician-content">
        <div className="politician-info-section">
          <div className="politician-details">
            <img
              src={politicianData.imgSrc}
              alt={politicianData.politician}
              className="politician-image"
            />
            <div className="politician-details-text">
              <h1>{politicianData.politician}</h1>
              <p className="politician-party">{politicianData.party}</p>
              <button
                className={`follow-button ${isFollowing ? "following" : ""}`}
                onClick={handleFollowClick}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            </div>
          </div>
        </div>

        <div className="chart-section-politician">
          <div className="metrics-politician">
            <div className="box trades">
              Trades: {tradeCount !== null ? tradeCount : "Loading..."}
            </div>
            <div className="box issuers">
              Issuers: {issuerCount !== null ? issuerCount : "Loading..."}
            </div>
            <div className="box total-volume">
              ~Total Volume: {formatNumber(totalTradeVolume)}
            </div>
            <div className="box avg-quarterly-volume">
              ~Avg. Quarterly Volume: {formatNumber(averageQuarterlyVolume)}
            </div>
          </div>
          <div className="chart-content-politician">
            <div className="left-side-politician">
              <div className="portfolioComp">
                {loadingPortfolioData ? (
                  <div>Loading Portfolio Composition...</div>
                ) : portfolioCompData.length > 0 ? (
                  <PortfolioCompositionChart data={portfolioCompData} />
                ) : (
                  <div>No portfolio composition data available.</div>
                )}
              </div>
              <div className="sectorActivity">
                {loadingSectorData ? (
                  <div>Loading Sector Activity...</div>
                ) : sectorActivityData.length > 0 ? (
                  <SectorActivityChart data={sectorActivityData} />
                ) : (
                  <div>No sector activity data available.</div>
                )}
              </div>
            </div>
            <div className="right-side-politician">
              <div className="tradeVolume">
                {loadingVolumeData ? (
                  <div>Loading Trade Volume...</div>
                ) : tradeVolumeData.length > 0 ? (
                  <TradeVolumeChart data={tradeVolumeData} />
                ) : (
                  <div>No trade volume data available.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="transactions-section">
        <h2>Recent Transactions</h2>
        {loadingTransactions ? (
          <div>Loading transactions...</div>
        ) : transactions.length > 0 ? (
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Asset Name</th>
                <th>Transaction Type</th>
                <th>~Transaction Volume</th>
                <th>Transaction Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => {
                let className = "";
                if (
                  transaction.transactionType.toLowerCase().includes("buy") ||
                  transaction.transactionType
                    .toLowerCase()
                    .includes("purchase") ||
                  transaction.transactionType.toLowerCase().includes("Receive")
                ) {
                  className = "positive";
                } else if (
                  transaction.transactionType.toLowerCase().includes("sell") ||
                  transaction.transactionType
                    .toLowerCase()
                    .includes("exchange") ||
                  transaction.transactionType.toLowerCase().includes("sale")
                ) {
                  className = "negative";
                }

                return (
                  <tr key={index}>
                    <td>{transaction.symbol}</td>
                    <td>{transaction.assetName}</td>
                    <td>{transaction.transactionType}</td>
                    <td className={className}>
                      ${parseFloat(transaction.averagePrice).toFixed(2)}
                    </td>
                    <td>
                      {new Date(
                        transaction.transactionDate
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div>No transactions found for this politician.</div>
        )}
      </div>

      {/* Render the CopyInvestorBox as a popup when showCopyInvestorBox is true */}
      {showCopyInvestorBox && (
        <div className="copy-investor-popup">
          <div
            className="copy-investor-overlay"
            onClick={handleCloseCopyInvestorBox}
          ></div>
          <div className="copy-investor-container">
            <CopyInvestorBox
              investorData={politicianData}
              onClose={handleCloseCopyInvestorBox}
              onInvest={handleInvest}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default PoliticianPage;
