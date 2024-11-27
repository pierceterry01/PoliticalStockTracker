// src/components/PoliticianCard.js
import React from 'react';
import '../styles/PoliticianCard.css';

function PoliticianCard({ politician, onUnfollow, onEdit }) {
  const {
    politicianName,
    imgSrc,
    party,
    sectors,
    investAmount,
  } = politician;

  // TEMP DATA NEEDS TO BE REPLACED WITH REAL DATA FROM API
  const performance = {
    '1D': 0.5,
    '1W': 1.2,
    '1M': 3.5,
    '3M': 7.0,
    '1Y': 15.0,
  };

  const handleUnfollowClick = () => {
    onUnfollow(politicianName);
  };

  const handleEditClick = () => {
    onEdit(politician);
  };

  // Sector abbreviations mapping (used abbreviations for display purposes)
  const sectorAbbreviations = {
    Energy: 'ENGY',
    Materials: 'MATR',
    Industrials: 'INDU',
    'Consumer Discretionary': 'CDIS',
    'Consumer Staples': 'CSTP',
    'Health Care': 'HLTH',
    Financials: 'FINL',
    'Information Technology': 'INFT',
    'Communication Services': 'CMNC',
    Utilities: 'UTIL',
    'Real Estate': 'REAL',
  };

  return (
    <div className="politician-card">
      {/* Header */}
      <div className="politician-header">
        <img src={imgSrc} alt={politicianName} className="politician-image" />
        <div className="politician-info">
          <h2>{politicianName}</h2>
          <p className="politician-party">{party}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="politician-content">
        <div className="investment-info">
          {/* Investment Amount */}
          <div className="investment-item">
            <span className="label">Investment Amount:</span>
            <span className="value">${investAmount.toLocaleString()}</span>
          </div>

          {/* Sectors */}
          <div className="investment-item">
            <span className="label">Sectors:</span>
            <div className="sectors-list">
              {sectors.map((sector, index) => (
                <span key={index} title={sector}>
                  {sectorAbbreviations[sector] || sector}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Section */}
        <div className="performance-section">
          <span className="performance-title">Performance:</span>
          <div className="performance-values">
            {Object.entries(performance).map(([timeFrame, percentChange]) => (
              <div key={timeFrame} className="performance-item">
                <span className="time-frame">{timeFrame}</span>
                <span
                  className={`percent-change ${
                    percentChange >= 0 ? 'positive' : 'negative'
                  }`}
                >
                  {percentChange >= 0 ? '+' : ''}
                  {percentChange}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="card-actions">
        <button className="edit-button" onClick={handleEditClick}>
          Edit Investment
        </button>
        <button className="unfollow-button" onClick={handleUnfollowClick}>
          Unfollow
        </button>
      </div>
    </div>
  );
}

export default PoliticianCard;
