import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import stockData from '../data/stockData';
import '../styles/PoliticianPage.css';
import CopyInvestorBox from './CopyInvestorBox';

function PoliticianPage() {
  const { politicianName } = useParams();
  const decodedName = decodeURIComponent(politicianName);
  const navigate = useNavigate();

  const politicianData = stockData.find(
    (p) => p.politician === decodedName
  );

  const [isFollowing, setIsFollowing] = useState(false);
  const [showCopyInvestorBox, setShowCopyInvestorBox] = useState(false);

  const handleFollowClick = () => {
    if (!isFollowing) {
      setShowCopyInvestorBox(true);
    } else {
      setIsFollowing(false);
      // Remove from localStorage if unfollowing
      const investments = JSON.parse(localStorage.getItem('investments')) || [];
      const updatedInvestments = investments.filter(
        (inv) => inv.politicianName !== politicianData.politician
      );
      localStorage.setItem('investments', JSON.stringify(updatedInvestments));
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
    let existingInvestments = JSON.parse(localStorage.getItem('investments')) || [];

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
    localStorage.setItem('investments', JSON.stringify(existingInvestments));

    navigate('/following');
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
                className={`follow-button ${isFollowing ? 'following' : ''}`}
                onClick={handleFollowClick}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* CopyInvestorBox Popup */}
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
