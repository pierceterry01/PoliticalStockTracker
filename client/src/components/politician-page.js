// PoliticianPage.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import stockData from '../data/stockData';
import '../styles/PoliticianPage.css';
import '../styles/chartSection.css';
import PortfolioCompositionChart from '../charts/portfolioComposition.js';
import SectorActivityChart from '../charts/sectorActivity.js';
import TradeVolumeChart from '../charts/tradeVolume.js';

// Import the CopyInvestorBox component
import CopyInvestorBox from './CopyInvestorBox';


function PoliticianPage() {
  const { politicianName } = useParams();
  const decodedName = decodeURIComponent(politicianName);

  const politicianData = stockData.find(
    (p) => p.politician === decodedName
  );

  // Sample Data Visualization Data
  const portfolioCompData = [
    { "symbol": "CLF", "count": 57 },
    { "symbol": "PYPL", "count": 29 },
    { "symbol": "INTC", "count": 24 },
    { "symbol": "QCOM", "count": 23 },
    { "symbol": "GOLD", "count": 16 }
  ];

  const sectorActivityData = [
      { sector: "Information Technology", count: 93 },
      { sector: "Industrials", count: 15 },
      { sector: "Health Care", count: 31 },
      { sector: "Consumer Discretionary", count: 38 },
      { sector: "Energy", count: 15 },
    ];
  
  const tradeVolumeData = [
    { "interval": "2024-Q1", "purchaseVolume": 24001.5, "saleVolume": 911513, "tradeCount": 29 },
    { "interval": "2024-Q2", "purchaseVolume": 577509.5, "saleVolume": 1900513, "tradeCount": 45 },
    { "interval": "2024-Q3", "purchaseVolume": 0, "saleVolume": 105502, "tradeCount": 4 },
    { "interval": "2024-Q4", "purchaseVolume": 0, "saleVolume": 227503.5, "tradeCount": 7 },
    { "interval": "2023-Q1", "purchaseVolume": 290502, "saleVolume": 96504.5, "tradeCount": 13 },
    { "interval": "2023-Q2", "purchaseVolume": 1649012.5, "saleVolume": 1039015, "tradeCount": 55 },
    { "interval": "2023-Q3", "purchaseVolume": 1021008.5, "saleVolume": 646505.5, "tradeCount": 28 },
    { "interval": "2023-Q4", "purchaseVolume": 750510, "saleVolume": 717511, "tradeCount": 42 },
    { "interval": "2022-Q1", "purchaseVolume": 377509.5, "saleVolume": 518014, "tradeCount": 47 },
    { "interval": "2022-Q2", "purchaseVolume": 1322006.5, "saleVolume": 791003.5, "tradeCount": 20 },
    { "interval": "2022-Q3", "purchaseVolume": 258001.5, "saleVolume": 81002, "tradeCount": 7 },
    { "interval": "2022-Q4", "purchaseVolume": 1628509.5, "saleVolume": 1100511, "tradeCount": 41 },
    { "interval": "2021-Q1", "purchaseVolume": 121004.5, "saleVolume": 112505.5, "tradeCount": 20 },
    { "interval": "2021-Q2", "purchaseVolume": 91001.5, "saleVolume": 129503.5, "tradeCount": 10 },
    { "interval": "2021-Q3", "purchaseVolume": 387505, "saleVolume": 245005, "tradeCount": 20 },
    { "interval": "2021-Q4", "purchaseVolume": 489004.5, "saleVolume": 212504.5, "tradeCount": 18 }
  ];
  
  // Calculate total trade volume
  const totalTradeVolume = tradeVolumeData.reduce(
    (total, item) => total + item.purchaseVolume + item.saleVolume,
    0
  );


  // Calculate average quarterly trade volume
  const averageQuarterlyVolume =
    tradeVolumeData.length > 0
      ? totalTradeVolume / tradeVolumeData.length
      : 0;
  

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

  // State to control the visibility of the CopyInvestorBox
  const [showCopyInvestorBox, setShowCopyInvestorBox] = useState(false);

  // Function to handle the Follow button click
  const handleFollowClick = () => {
    if (!isFollowing) {
      // Show the CopyInvestorBox when the user clicks 'Follow'
      setShowCopyInvestorBox(true);
    } else {
      // If already following, allow the user to unfollow
      setIsFollowing(false);
    }
  };

  // Function to handle closing the CopyInvestorBox
  const handleCloseCopyInvestorBox = () => {
    setShowCopyInvestorBox(false);
  };

  // Function to handle Invest action
  const handleInvest = () => {
    setIsFollowing(true);
    setShowCopyInvestorBox(false);
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
              <p className="politician-party">
                {politicianData.party}
              </p>
              <button
                className={`follow-button ${isFollowing ? 'following' : ''}`}
                onClick={handleFollowClick}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          </div>
          <div className="politician-stats">
            {/* ... existing stats code ... */}
          </div>
        </div>



        {/* Data Visualization Section */}
        <div className="chart-section">
          <div className="metrics">
            <div className="box trades">Trades: (x)</div>
            <div className="box issuers">Issuers: (x)</div>
            <div className="box total-volume">Total Volume: {formatNumber(totalTradeVolume)}</div>
            <div className="box avg-quarterly-volume">Avg. Quarterly Volume: {formatNumber(averageQuarterlyVolume)}</div>
          </div>
          <div className="content">
            <div className="left-side">
              <div className="portfolioComp">
                {portfolioCompData.length > 0 ? (
                  <PortfolioCompositionChart data={portfolioCompData} />
                ) : (
                  <div>No portfolio composition data available.</div>
                )}
              </div>
              <div className="sectorActivity">
                {sectorActivityData.length > 0 ? (
                  <SectorActivityChart data={sectorActivityData} />
                ) : (
                  <div>No sector activity data available.</div>
                )}
              </div>
            </div>
            <div className="right-side">
              <div className="tradeVolume">
                {tradeVolumeData.length > 0 ? (
                  <TradeVolumeChart data={tradeVolumeData} />
                ) : (
                  <div>No trade volume data available.</div>
                )}
              </div>
            </div>
          </div>
        </div>
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
              onInvest={handleInvest} // Pass the handleInvest function
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default PoliticianPage;
