// PoliticianPage.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import stockData from '../data/stockData';
import '../styles/PoliticianPage.css';

function PoliticianPage() {
  const { politicianName } = useParams();
  const decodedName = decodeURIComponent(politicianName);

  const politicianData = stockData.find(
    (p) => p.politician === decodedName
  );

  // State for the follow button
  const [isFollowing, setIsFollowing] = useState(false);

  // Toggle follow state
  const handleFollowClick = () => {
    setIsFollowing(!isFollowing);
  };

  if (!politicianData) {
    return (
      <div className="politician-page">
        <div className="politician-content">
          <h1>Politician not found</h1>
          {/* You can keep the back button if you want */}
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
            <div className="stat-item">
              <span className="stat-label">Change $:</span>
              <span className="stat-value">
                ${politicianData.changeDollar.toLocaleString()}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Change %:</span>
              <span
                className={`stat-value ${
                  politicianData.changePercent >= 0 ? 'positive' : 'negative'
                }`}
              >
                {politicianData.changePercent > 0 ? '+' : ''}
                {politicianData.changePercent}%
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Copiers:</span>
              <span className="stat-value">{politicianData.copiers}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Last Traded:</span>
              <span className="stat-value">
                {new Date(politicianData.lastTraded).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Placeholder for Data Visualization */}
        <div className="data-visualization-placeholder">
          {/* This is where the data visualization will go */}
          <p>Data visualization coming soon...</p>
        </div>
      </div>
    </div>
  );
}

export default PoliticianPage;
