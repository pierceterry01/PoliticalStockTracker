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
    <div className="pc-politician-card">
      {/* Header */}
      <div className="pc-politician-header">
        <img src={imgSrc} alt={politicianName} className="pc-politician-image" />
        <div className="pc-politician-info">
          <h2 className="pc-politician-name">{politicianName}</h2>
          <p className="pc-politician-party">{party}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="pc-politician-content">
        {/* Investment Section */}
        <div className="pc-investment-section">
          <h3>Investment</h3>
          <div className="pc-decorative-line"></div>
          <div className="pc-investment-list">
            <div className="pc-investment-item">
              <span className="pc-value">${investAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Sectors Section */}
        <div className="pc-sectors-section">
          <h3>Sectors</h3>
          <div className="pc-decorative-line"></div>
          <div className="pc-sectors-list">
            {sectors.map((sector, index) => (
              <span key={index} title={sector} className="pc-sector-badge">
                {sectorAbbreviations[sector] || sector}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="pc-card-actions">
        <button className="pc-edit-button" onClick={handleEditClick}>
          Edit
        </button>
        <button className="pc-unfollow-button" onClick={handleUnfollowClick}>
          Unfollow
        </button>
      </div>
    </div>
  );
}

export default PoliticianCard;
