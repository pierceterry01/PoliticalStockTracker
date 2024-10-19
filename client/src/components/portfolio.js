import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/styles.css";

// Example stock symbols to track
const stockSymbols = [
  "AAPL", // Apple Inc.
  "MSFT", // Microsoft Corporation
  "GOOGL", // Alphabet Inc. (Google)
  "TSLA", // Tesla Inc.
  "NVDA", // NVIDIA Corporation
  "AMZN", // Amazon.com Inc.
  "FB", // Meta Platforms, Inc. (formerly Facebook)
  "NFLX", // Netflix, Inc.
  "BRK.B", // Berkshire Hathaway Inc.
  "V", // Visa Inc.
  "JPM", // JPMorgan Chase & Co.
  "JNJ", // Johnson & Johnson
  "PG", // Procter & Gamble Co.
  "DIS", // The Walt Disney Company
  "XOM", // Exxon Mobil Corporation
  "KO", // The Coca-Cola Company
  "PEP", // PepsiCo, Inc.
  "BA", // Boeing Co.
  "INTC", // Intel Corporation
  "CSCO", // Cisco Systems, Inc.
  "VZ", // Verizon Communications Inc.
  "PFE", // Pfizer Inc.
  "UNH", // UnitedHealth Group Incorporated
  "WMT", // Walmart Inc.
  "MA", // Mastercard Inc.
  "HD", // The Home Depot, Inc.
  "BABA", // Alibaba Group Holding Limited
  "PYPL", // PayPal Holdings, Inc.
  "ORCL", // Oracle Corporation
  "ADBE", // Adobe Inc.
];

function PortfolioPage({ politician = "Nancy Pelosi" }) {
  const [trades, setTrades] = useState([]);
  const [stockSummary, setStockSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPortfolioValue, setTotalPortfolioValue] = useState(0); // Total value of the portfolio

  // Function to fetch trades for a symbol from the backend API
  const fetchTradesForSymbol = async (symbol, fromDate, toDate) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/congressional-trading`,
        {
          params: {
            symbol: symbol,
            from: fromDate,
            to: toDate,
          },
        }
      );

      // Check if response contains valid data
      if (response.status === 200 && response.data && response.data.data) {
        return response.data.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error(`Error fetching trades for ${symbol}:`, error);
      return [];
    }
  };

  // Function to fetch all trades for the politician within given time period
  const fetchTradesForPolitician = async () => {
    const fromDate = "2020-01-01";
    const toDate = "2024-12-31";

    try {
      setLoading(true);
      const allTrades = [];

      for (const symbol of stockSymbols) {
        const tradesForSymbol = await fetchTradesForSymbol(
          symbol,
          fromDate,
          toDate
        );

        // Filter the trades based on the politician's name
        const filteredTrades = tradesForSymbol.filter(
          (trade) => trade.name.toLowerCase() === politician.toLowerCase()
        );
        allTrades.push(...filteredTrades);
      }

      // Remove exact duplicates from the list of trades
      const uniqueTrades = removeDuplicateTrades(allTrades);

      // Sort trades by date in descending order
      const sortedTrades = uniqueTrades.sort(
        (a, b) => new Date(b.transactionDate) - new Date(a.transactionDate)
      );

      setTrades(sortedTrades);
      setLoading(false);
      calculateStockSummary(uniqueTrades); // Update the stock summary
    } catch (error) {
      console.error("Error fetching trades:", error);
      setLoading(false);
    }
  };

  // Function to remove exact duplicate trades based on symbol, transactionDate, transactionType, amountFrom, and amountTo
  const removeDuplicateTrades = (trades) => {
    const uniqueTradesMap = {};

    trades.forEach((trade) => {
      const key = `${trade.symbol}-${trade.transactionDate}-${trade.transactionType}-${trade.amountFrom}-${trade.amountTo}`;

      // If the key doesn't exist, add the trade to the map
      if (!uniqueTradesMap[key]) {
        uniqueTradesMap[key] = trade;
      }
    });

    // Return an array of unique trades
    return Object.values(uniqueTradesMap);
  };

  // Calculate stock summary (average amount per stock owned by the politician)
  const calculateStockSummary = (trades) => {
    const stockSummaryMap = {};
    let totalValue = 0; // Calculate the total value of the portfolio

    trades.forEach((trade) => {
      const { symbol, amountFrom, amountTo } = trade;

      // Calculate the average of amountFrom and amountTo
      const averageAmount = (amountFrom + amountTo) / 2;

      // Accumulate the total portfolio value
      totalValue += averageAmount;

      // If the stock is already in the summary, update the estimated total
      if (stockSummaryMap[symbol]) {
        stockSummaryMap[symbol].estimatedTotal += averageAmount;
      } else {
        // Otherwise, create a new entry for the stock
        stockSummaryMap[symbol] = {
          symbol: symbol,
          estimatedTotal: averageAmount,
        };
      }
    });

    setTotalPortfolioValue(totalValue); // Set the total portfolio value

    // Convert the map to an array for easy rendering
    const stockSummaryArray = Object.values(stockSummaryMap);
    setStockSummary(stockSummaryArray);
  };

  // Fetch trades for given politician
  useEffect(() => {
    fetchTradesForPolitician();
  }, [politician]);

  return (
    <div id="portfolioBody">
      <a href="/" className="back-button">
        Back to Home
      </a>
      <header id="portfolioHeader">
        <h1>{politician}'s Stock Portfolio</h1>
      </header>

      {/* Portfolio summary */}
      <div id="stock-summary">
        {loading ? (
          <div>Loading stock summary...</div>
        ) : stockSummary.length > 0 ? (
          <table id="stockSummaryTable">
            <thead>
              <tr>
                <th>Stock Symbol</th>
                <th>Estimated Total</th>
              </tr>
            </thead>
            <tbody>
              {stockSummary.map((stock, index) => (
                <tr key={index}>
                  <td>{stock.symbol}</td>
                  <td>${stock.estimatedTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>

                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>No stocks found for {politician}.</div>
        )}
      </div>

      {/* Display total portfolio value */}
      <div id="total-portfolio-value">
        <h2 style={{ color: "green" }}>
          Total Portfolio Value: ${totalPortfolioValue.toLocaleString()}
        </h2>
      </div>

      {/* Trades Details Table */}
      <div id="trades">
        <h3>All Trades </h3>
        {loading ? (
          <div>Loading trades...</div>
        ) : trades.length > 0 ? (
          <table id="tradesTable">
            <thead>
              <tr>
                <th>Date</th>
                <th>Symbol</th>
                <th>Asset Name</th>
                <th>Type</th>
                <th>Amount Range</th>
                <th>Stock Price</th>
              </tr>
            </thead>


            <tbody>
              {trades.map((trade, index) => (
                <tr key={index}>
                  <td>{trade.transactionDate}</td>
                  <td>{trade.symbol}</td>
                  <td>{trade.assetName}</td>
                  <td
                    className={
                      ["buy", "purchase"].includes(
                        trade.transactionType.toLowerCase()
                      )
                        ? "buy"
                        : "sell"
                    }
                  >
                    {trade.transactionType}{" "}
                    {/* This will apply the correct class to make transaction type either green or red */}
                  </td>
                  <td>
                    $
                    {trade.amountFrom.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    - $
                    {trade.amountTo.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    {/* Display the range */}
                  </td>
                  <td>$0.00</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>No trades found for {politician}.</div>
        )}
      </div>
    </div>
  );
}

export default PortfolioPage;
