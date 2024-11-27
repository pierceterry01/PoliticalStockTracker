import React, { useState, useEffect } from 'react';
import '../styles/FollowingPage.css';
import PoliticianCard from './PoliticianCard';
import CopyInvestorBox from './CopyInvestorBox';

function FollowingPage() {
  const [followingData, setFollowingData] = useState([]);
  const [showCopyInvestorBox, setShowCopyInvestorBox] = useState(false);
  const [selectedPolitician, setSelectedPolitician] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // Added searchTerm state

  useEffect(() => {
    const investments = JSON.parse(localStorage.getItem('investments')) || [];
    setFollowingData(investments);
  }, []);

  const handleUnfollow = (politicianName) => {
    const updatedInvestments = followingData.filter(
      (inv) => inv.politicianName !== politicianName
    );
    setFollowingData(updatedInvestments);
    localStorage.setItem('investments', JSON.stringify(updatedInvestments));
  };

  const handleEdit = (politician) => {
    setSelectedPolitician(politician);
    setShowCopyInvestorBox(true);
  };

  const handleCloseCopyInvestorBox = () => {
    setShowCopyInvestorBox(false);
    setSelectedPolitician(null);
  };

  const handleInvest = (investmentData) => {
    // Update investment data
    const updatedInvestments = followingData.map((inv) =>
      inv.politicianName === investmentData.politicianName
        ? { ...inv, ...investmentData }
        : inv
    );
    setFollowingData(updatedInvestments);
    localStorage.setItem('investments', JSON.stringify(updatedInvestments));
    setShowCopyInvestorBox(false);
  };

  // Filter followingData based on searchTerm
  const filteredData = followingData.filter((politician) =>
    politician.politicianName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="following-page">
      <h1>Your Followed Politicians</h1>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          className="custom-input"
          placeholder="Search your followed politicians..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="politician-list">
        {filteredData.length > 0 ? (
          filteredData.map((politician, index) => (
            <PoliticianCard
              key={index}
              politician={politician}
              onUnfollow={handleUnfollow}
              onEdit={handleEdit}
            />
          ))
        ) : (
          <p>No politicians match your search.</p>
        )}
      </div>

      {/* CopyInvestorBox Popup */}
      {showCopyInvestorBox && selectedPolitician && (
        <div className="copy-investor-popup">
          <div
            className="copy-investor-overlay"
            onClick={handleCloseCopyInvestorBox}
          ></div>
          <div className="copy-investor-container">
            <CopyInvestorBox
              investorData={selectedPolitician}
              onClose={handleCloseCopyInvestorBox}
              onInvest={handleInvest}
              isEditing={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default FollowingPage;
