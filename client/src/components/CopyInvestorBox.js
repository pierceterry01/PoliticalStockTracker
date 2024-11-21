// CopyInvestorBox.js
import React, { useState } from 'react';
import '../styles/CopyInvestorBox.css';

function CopyInvestorBox({ investorData, onClose, onInvest }) {
  // State variables
  const [step, setStep] = useState(1);

  // Investment amount and stop-loss
  const [investAmount, setInvestAmount] = useState(1000);
  const [stopLossAmount, setStopLossAmount] = useState(900);

  // Sector selection
  const allSectors = [
    'Energy',
    'Materials',
    'Industrials',
    'Consumer Discretionary',
    'Consumer Staples',
    'Health Care',
    'Financials',
    'Information Technology',
    'Communication Services',
    'Utilities',
    'Real Estate',
  ];

  const [selectedSectors, setSelectedSectors] = useState([...allSectors]); // Default to all sectors

  // Investment allocation per sector
  const [sectorAllocations, setSectorAllocations] = useState({});

  // Handle Next button click
  const handleNextClick = () => {
    if (step === 1) {
      // Validate invest amount and stop-loss
      if (investAmount <= 0 || stopLossAmount <= 0) {
        alert('Please enter valid amounts.');
        return;
      }
    }
    if (step === 2) {
      if (selectedSectors.length === 0) {
        alert('Please select at least one sector.');
        return;
      }
      // Initialize allocations to equal percentages
      const equalAllocation = (100 / selectedSectors.length).toFixed(2);
      const allocations = {};
      selectedSectors.forEach((sector) => {
        allocations[sector] = parseFloat(equalAllocation);
      });
      setSectorAllocations(allocations);
    }
    if (step === 3) {
      // Validate allocations sum to 100%
      const totalAllocation = Object.values(sectorAllocations).reduce(
        (acc, val) => acc + parseFloat(val),
        0
      );
      if (Math.round(totalAllocation) !== 100) {
        alert('Allocations must sum up to 100%.');
        return;
      }
    }
    if (step < 3) {
      setStep((prev) => prev + 1);
    } else {
      handleInvestClick();
    }
  };

  // Handle Back button click
  const handleBackClick = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  // Handle Invest button click
  const handleInvestClick = () => {
    // Prepare investment data
    const investmentData = {
      investAmount,
      stopLossAmount,
      selectedSectors,
      sectorAllocations,
    };
    // Call onInvest prop function
    onInvest(investmentData);
  };

  // Handle sector selection
  const toggleSector = (sector) => {
    setSelectedSectors((prev) => {
      if (prev.includes(sector)) {
        return prev.filter((s) => s !== sector);
      } else {
        return [...prev, sector];
      }
    });
  };

  // Handle allocation change
  const handleAllocationChange = (sector, value) => {
    const val = parseFloat(value) || 0;
    setSectorAllocations((prev) => ({
      ...prev,
      [sector]: val,
    }));
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            {/* Invest Amount */}
            <div className="invest-amount">
              <label htmlFor="invest-amount-input">Amount to invest:</label>
              <div className="amount-input-group">
                <span className="input-prefix">$</span>
                <input
                  id="invest-amount-input"
                  type="number"
                  value={investAmount}
                  onChange={(e) => setInvestAmount(Number(e.target.value))}
                  aria-label="Invest amount"
                  min="0"
                />
              </div>
            </div>

            {/* Stop-Loss Amount */}
            <div className="stop-loss-setting">
              <label htmlFor="stop-loss-amount-input">
                Close this investment if its value drops below:
              </label>
              <div className="amount-input-group">
                <span className="input-prefix">$</span>
                <input
                  id="stop-loss-amount-input"
                  type="number"
                  value={stopLossAmount}
                  onChange={(e) => setStopLossAmount(Number(e.target.value))}
                  aria-label="Stop-loss amount"
                  min="0"
                />
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="sector-selection">
              <h3>Select Sectors to Follow:</h3>
              <div className="sector-list">
                {allSectors.map((sector) => (
                  <label key={sector} className="sector-item">
                    <input
                      type="checkbox"
                      checked={selectedSectors.includes(sector)}
                      onChange={() => toggleSector(sector)}
                    />
                    <span>{sector}</span>
                  </label>
                ))}
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="allocation-setting">
              <h3>Allocate Investment Across Sectors:</h3>
              <div className="allocation-list">
                {selectedSectors.map((sector) => (
                  <div key={sector} className="allocation-item">
                    <label>{sector}:</label>
                    <div className="allocation-input-group">
                      <input
                        type="number"
                        value={sectorAllocations[sector]}
                        onChange={(e) =>
                          handleAllocationChange(sector, e.target.value)
                        }
                        aria-label={`${sector} allocation percentage`}
                        min="0"
                        max="100"
                      />
                      <span>%</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="total-allocation">
                Total Allocation:{" "}
                {Object.values(sectorAllocations).reduce(
                  (acc, val) => acc + parseFloat(val || 0),
                  0
                ).toFixed(2)}
                %
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="copy-investor-box">
      {/* Close Button */}
      <button className="close-button" onClick={onClose} aria-label="Close">
        &times;
      </button>

      {/* Header Section */}
      <div className="header-section">
        <h2>Copy this Investor</h2>
        <div className="investor-info">
          <img src={investorData.imgSrc} alt={investorData.politician} />
          <span className="investor-name">{investorData.politician}</span>
        </div>
        <div className="investor-return">
          <span
            className={`return-percentage ${
              investorData.changePercent >= 0 ? 'positive' : 'negative'
            }`}
          >
            {investorData.changePercent >= 0 ? '+' : ''}
            {investorData.changePercent}% over 12 months
          </span>
        </div>
      </div>

      {/* Body Section */}
      <div className="body-section">{renderStepContent()}</div>

      {/* Footer Section */}
      <div className="footer-section">
        {step > 1 && (
          <button className="back-button" onClick={handleBackClick}>
            Back
          </button>
        )}
        <button className="next-button" onClick={handleNextClick}>
          {step < 3 ? 'Next' : 'Invest'}
        </button>
      </div>
    </div>
  );
}

export default CopyInvestorBox;
