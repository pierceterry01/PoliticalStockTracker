const express = require("express");
const router = express.Router();

const sectorMapping = {
  "AAPL": "Information Technology", "MSFT": "Information Technology", "NVDA": "Information Technology",
  "CSCO": "Information Technology", "INTC": "Information Technology", "ORCL": "Information Technology",
  "ADBE": "Information Technology", "AMD": "Information Technology", "IBM": "Information Technology",
  "QCOM": "Information Technology", "TXN": "Information Technology", "AVGO": "Information Technology",
  "HPE": "Information Technology", "MU": "Information Technology", "SNOW": "Information Technology",
  "SHOP": "Information Technology", "TWLO": "Information Technology", "DOCU": "Information Technology",
  "TTD": "Information Technology", "U": "Information Technology", "PINS": "Information Technology",
  "TSLA": "Consumer Discretionary", "AMZN": "Consumer Discretionary", "NFLX": "Consumer Discretionary",
  "DIS": "Consumer Discretionary", "BABA": "Consumer Discretionary", "HD": "Consumer Discretionary",
  "NKE": "Consumer Discretionary", "SBUX": "Consumer Discretionary", "MCD": "Consumer Discretionary",
  "TGT": "Consumer Discretionary", "RCL": "Consumer Discretionary", "MAR": "Consumer Discretionary",
  "NCLH": "Consumer Discretionary", "WYNN": "Consumer Discretionary", "MGM": "Consumer Discretionary",
  "GM": "Consumer Discretionary", "F": "Consumer Discretionary", "EBAY": "Consumer Discretionary",
  "ETSY": "Consumer Discretionary", "LYFT": "Consumer Discretionary", "UBER": "Consumer Discretionary",
  "DAL": "Consumer Discretionary", "UAL": "Consumer Discretionary",
  "GOOGL": "Communications Services", "META": "Communications Services", "VZ": "Communications Services",
  "CMCSA": "Communications Services", "ATVI": "Communications Services", "RBLX": "Communications Services",
  "ROKU": "Communications Services", "ZM": "Communications Services",
  "JPM": "Financials", "V": "Financials", "MA": "Financials", "BRK.B": "Financials", "BAC": "Financials",
  "C": "Financials", "GS": "Financials", "MS": "Financials", "USB": "Financials", "BLK": "Financials",
  "BK": "Financials", "AXP": "Financials", "SPGI": "Financials",
  "UNH": "Health Care", "JNJ": "Health Care", "PFE": "Health Care", "MRK": "Health Care", "ABT": "Health Care",
  "CVS": "Health Care", "ABBV": "Health Care", "MDT": "Health Care", "DHR": "Health Care", "ISRG": "Health Care",
  "SYK": "Health Care", "ZTS": "Health Care", "LLY": "Health Care", "CI": "Health Care", "ANTM": "Health Care",
  "HUM": "Health Care", "ELV": "Health Care", "MOH": "Health Care", "CNC": "Health Care", "GILD": "Health Care",
  "PG": "Consumer Staples", "KO": "Consumer Staples", "PEP": "Consumer Staples", "WMT": "Consumer Staples",
  "MDLZ": "Consumer Staples", "TAP": "Consumer Staples", "GIS": "Consumer Staples", "CPB": "Consumer Staples",
  "K": "Consumer Staples", "SJM": "Consumer Staples", "HSY": "Consumer Staples", "MKC": "Consumer Staples",
  "CL": "Consumer Staples", "CLX": "Consumer Staples", "STZ": "Consumer Staples", "MNST": "Consumer Staples",
  "XOM": "Energy", "CVX": "Energy", "NEE": "Energy",
  "BA": "Industrials", "CAT": "Industrials", "GE": "Industrials", "MMM": "Industrials", "HON": "Industrials",
  "RTX": "Industrials", "UPS": "Industrials",
  "LIN": "Materials",
  "DUK": "Utilities", "AEP": "Utilities",
  "AMT": "Real Estate", "PLD": "Real Estate"
};

module.exports = (pool) => {

  // GET /api/stocks-held
  router.get('/stocks-held', async (req, res) => {
    try {
      const { politicians } = req.query;

      if (!politicians) {
        return res.status(400).json({ error: "Politicians parameter is required." });
      }

      const followedPoliticians = politicians.split(',');

      if (followedPoliticians.length === 0) {
        return res.status(200).json([]);
      }

      const placeholders = followedPoliticians.map(() => '?').join(',');

      const query = `
        SELECT politicianName, symbol, assetName
        FROM trades
        WHERE politicianName IN (${placeholders})
      `;

      const [results] = await pool.query(query, followedPoliticians);

      const uniqueStocks = {};
      results.forEach((stock) => {
        if (!uniqueStocks[stock.symbol]) {
          uniqueStocks[stock.symbol] = {
            symbol: stock.symbol,
            assetName: stock.assetName,
            politicianName: stock.politicianName,
            sector: sectorMapping[stock.symbol] || "N/A"  
          };
        }
      });

      const uniqueStockArray = Object.values(uniqueStocks).slice(0, 15);

      console.log("Final unique stocks:", uniqueStockArray);

      res.status(200).json(uniqueStockArray);
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });



  // Endpoint to fetch trade volume data
  router.get("/trade-volume", async (req, res) => {
    const { politicianName } = req.query;

    try {
       if (!politicianName) {
        console.error("No politician name provided");
        return res.status(400).json({ error: "Politician name is required" });
      }

       if (!pool) {
        console.error("Database pool is not defined");
        return res.status(500).json({ error: "Database connection error" });
      }

      // Define date range for the past 4 years
      const endDate = new Date();
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 4);
      startDate.setMonth(0);  
      startDate.setDate(1);

      // Format dates for the query
      const formattedStartDate = startDate.toISOString().split("T")[0];
      const formattedEndDate = endDate.toISOString().split("T")[0];

      // Fetch trades for the given politician within the date range
      let trades;
      try {
        [trades] = await pool.query(
          `SELECT transactionDate, transactionType, amountFrom, amountTo
               FROM trades
               WHERE politicianName = ? AND transactionDate BETWEEN ? AND ?
               ORDER BY transactionDate`,
          [politicianName, formattedStartDate, formattedEndDate]
        );
      } catch (queryError) {
        console.error(
          "Error executing database query:",
          queryError.message,
          queryError.stack
        );
        return res
          .status(500)
          .json({ error: "Failed to execute database query" });
      }

      // Check if trades were fetched successfully
      if (!trades || trades.length === 0) {
        console.warn(`No trades found for politician: ${politicianName}`);
        return res
          .status(404)
          .json({ error: "No trades found for the given politician" });
      }

      const quarterlyData = {};

      // Initialize quarterlyData for the past 4 years
      const startYear = new Date().getFullYear() - 4;
      const endYear = new Date().getFullYear();
      for (let year = startYear; year <= endYear; year++) {
        for (let quarter = 1; quarter <= 4; quarter++) {
          quarterlyData[`${year}-Q${quarter}`] = {
            purchaseVolume: 0,
            saleVolume: 0,
            tradeCount: 0,
          };
        }
      }

      // Process each trade
      trades.forEach((trade) => {
        const { transactionDate, transactionType, amountFrom, amountTo } =
          trade;

        // Validate transactionDate
        const date = new Date(transactionDate);
        if (isNaN(date.getTime())) {
          console.warn(`Invalid transaction date: ${transactionDate}`);
          return;  
        }

        const year = date.getFullYear();
        const quarter = Math.ceil((date.getMonth() + 1) / 3);
        const quarterKey = `${year}-Q${quarter}`;

        if (!quarterlyData[quarterKey]) return; 

        // Validate and calculate average volume 
        const validAmountFrom =
          typeof amountFrom === "number"
            ? amountFrom
            : parseFloat(amountFrom) || 0;
        const validAmountTo =
          typeof amountTo === "number" ? amountTo : parseFloat(amountTo) || 0;
        const volume = (validAmountFrom + validAmountTo) / 2;

         const type = transactionType.trim().toLowerCase();

        // Categorize the transaction based on type
        if (type.includes("purchase") || type.includes("buy")) {
          quarterlyData[quarterKey].purchaseVolume += volume;
        } else if (type.includes("sale") || type.includes("sell")) {
          quarterlyData[quarterKey].saleVolume += volume;
        } else if (type.includes("exchange")) {
        } else {
          console.warn(`Unknown transaction type: ${transactionType}`);
        }

         quarterlyData[quarterKey].tradeCount++;
      });

      // Reformat data for the response
      const result = Object.keys(quarterlyData).map((key) => ({
        interval: key,
        ...quarterlyData[key],
      }));

       res.status(200).json(result);
    } catch (error) {
      console.error(
        "Unexpected error occurred in trade-volume endpoint:",
        error.message,
        error.stack
      );
      res
        .status(500)
        .json({
          error:
            "An unexpected error has occurred when attempting to retrieve the trading volume data",
        });
    }
  });

  // Endpoint to fetch latest trade date for each politician
  router.get("/latest-trade-data", async (req, res) => {
    try {
      // Query to get the most recent trade for each politician
      const [latestTrades] = await pool.query(`
          SELECT politicianName, MAX(transactionDate) as lastTraded
          FROM trades
          GROUP BY politicianName
      `);

      res.status(200).json(latestTrades);
    } catch (error) {
      console.error(
        "Error fetching latest trade data:",
        error.message,
        error.stack
      );
      res
        .status(500)
        .json({
          error:
            "An error has occurred when attempting to retrieve the latest trade data.",
        });
    }
  });

  // Endpoint to get individual transactions for a politician
  router.get("/stocks", async (req, res) => {
    const { politicianName } = req.query;
  
    if (!politicianName) {
      return res.status(400).json({ error: "Politician name is required" });
    }
  
    try {
      const query = `
        SELECT 
        t.symbol AS symbol,
        t.assetName AS assetName,
        ROUND(AVG((t.amountFrom + t.amountTo) / 2), 2) AS averagePrice,
        MAX(t.filingDate) AS filingDate,
        MAX(t.transactionDate) AS transactionDate,
        t.transactionType AS transactionType
        FROM trades t
        WHERE t.politicianName = ?
        GROUP BY t.symbol, t.assetName, t.transactionType
        ORDER BY transactionDate DESC;


      `;
  
      const [results] = await pool.execute(query, [politicianName]);
  
      res.json(results);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ error: "An error occurred while fetching transactions." });
    }
  });
  


  /*

  router.get("/current-stock-price", async (req, res) => {
    const { symbol } = req.query;
  
    if (!symbol) {
      return res.status(400).json({ error: "Stock symbol is required" });
    }
  
    try {
      console.log(`Requesting stock price for symbol: ${symbol}`);
      const response = await axios.get("https://finnhub.io/api/v1/quote", {
        params: {
          symbol: symbol,
          token: process.env.FINNHUB_API_KEY,
        },
      });
      console.log("Finnhub API response:", response.data);
  
      const { c: currentPrice, h: highPrice, l: lowPrice, o: openPrice } = response.data;
  
      if (!currentPrice) {
        return res.status(404).json({ error: "Current stock price not available." });
      }
  
      res.status(200).json({
        symbol,
        currentPrice,
        highPrice,
        lowPrice,
        openPrice,
      });
    } catch (error) {
      console.error("Error fetching current stock price:", error);
      res.status(500).json({
        error: "An error occurred while fetching the current stock price.",
        details: error.message,
      });
    }
  });
  
  */

  

  return router;
};
