import React, { useState, useEffect } from 'react';
import '../styles/CopyInvestorBox.css';

function CopyInvestorBox({ investorData, onClose, onInvest, isEditing }) {
  const [step, setStep] = useState(1);

  // Initialize state w/ existing data if editing
  const [investAmount, setInvestAmount] = useState(
    isEditing ? investorData.investAmount : 1000
  );
  const [stopLossAmount, setStopLossAmount] = useState(
    isEditing ? investorData.stopLossAmount : 900
  );

  const allSectors = {
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

  const [selectedSectors, setSelectedSectors] = useState(
    isEditing ? investorData.sectors : Object.keys(allSectors)
  );
  const [sectorAllocations, setSectorAllocations] = useState(
    isEditing ? investorData.sectorAllocations : {}
  );

  // Synchronize sectorAllocations with selectedSectors
  useEffect(() => {
    setSectorAllocations((prevAllocations) => {
      const newAllocations = {};
      selectedSectors.forEach((sector) => {
        if (prevAllocations.hasOwnProperty(sector)) {
          newAllocations[sector] = prevAllocations[sector];
        } else {
          // Assign default allocation (0 or equal allocation)
          newAllocations[sector] = 0;
        }
      });
      return newAllocations;
    });
  }, [selectedSectors]);

  // Initialize allocations when entering Step 3
  useEffect(() => {
    if (step === 3) {
      if (Object.keys(sectorAllocations).length === 0) {
        // Initialize allocations to equal percentages
        const equalAllocation = (100 / selectedSectors.length).toFixed(2);
        const allocations = {};
        selectedSectors.forEach((sector) => {
          allocations[sector] = parseFloat(equalAllocation);
        });
        setSectorAllocations(allocations);
      } else {
        // Adjust allocations to sum up to 100%
        const total = Object.values(sectorAllocations).reduce(
          (acc, val) => acc + parseFloat(val || 0),
          0
        );
        if (total !== 100) {
          const adjustedAllocations = {};
          selectedSectors.forEach((sector) => {
            adjustedAllocations[sector] =
              (sectorAllocations[sector] / total) * 100;
          });
          setSectorAllocations(adjustedAllocations);
        }
      }
    }
  }, [step, selectedSectors, sectorAllocations]);

  const handleNextClick = () => {
    if (step === 1) {
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
    }
    if (step === 3) {
      const totalAllocation = selectedSectors.reduce(
        (acc, sector) => acc + parseFloat(sectorAllocations[sector] || 0),
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

  const handleBackClick = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleInvestClick = () => {
    const investmentData = {
      politicianName: investorData.politicianName || investorData.politician,
      imgSrc: investorData.imgSrc,
      party: investorData.party,
      sectors: selectedSectors,
      investAmount,
      sectorAllocations,
      stopLossAmount,
    };
    onInvest(investmentData);
  };

  const toggleSector = (sector) => {
    setSelectedSectors((prev) => {
      if (prev.includes(sector)) {
        return prev.filter((s) => s !== sector);
      } else {
        return [...prev, sector];
      }
    });
  };

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
                {Object.keys(allSectors).map((sector) => (
                  <label key={sector} className="sector-item" title={sector}>
                    <input
                      type="checkbox"
                      checked={selectedSectors.includes(sector)}
                      onChange={() => toggleSector(sector)}
                    />
                    <span>{allSectors[sector]}</span>
                  </label>
                ))}
              </div>
            </div>
          </>
        );
      case 3:
        // Calculate total allocation for selected sectors
        const totalAllocation = selectedSectors.reduce(
          (acc, sector) => acc + parseFloat(sectorAllocations[sector] || 0),
          0
        );

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
                Total Allocation: {totalAllocation.toFixed(2)}%
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
        <h2>{isEditing ? 'Edit Investment' : 'Copy this Investor'}</h2>
        <div className="investor-info">
          <img
            src={investorData.imgSrc}
            alt={investorData.politicianName || investorData.politician}
          />
          <span className="investor-name">
            {investorData.politicianName || investorData.politician}
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
          {step < 3 ? 'Next' : isEditing ? 'Save' : 'Invest'}
        </button>
      </div>
    </div>
  );
}

export default CopyInvestorBox;
