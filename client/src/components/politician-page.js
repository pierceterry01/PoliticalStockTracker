// PoliticianPage.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import stockData from '../data/stockData';
import '../styles/PoliticianPage.css';

// Import the CopyInvestorBox component
import CopyInvestorBox from './CopyInvestorBox';

function PoliticianPage() {
  const { politicianName } = useParams();
  const decodedName = decodeURIComponent(politicianName);

  const politicianData = stockData.find(
    (p) => p.politician === decodedName
  );

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

        {/* Placeholder for Data Visualization */}
        <div className="data-visualization-placeholder">
          <p>Data visualization coming soon...</p>
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
