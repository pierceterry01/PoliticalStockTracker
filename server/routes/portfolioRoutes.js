const express = require("express");
const router = express.Router();

module.exports = (pool) => {
  // Endpoint to fetch portfolio composition
  router.get("/portfolio-composition", async (req, res) => {
    const { politicianName } = req.query;

    try {
      const [rows] = await pool.query(
        `SELECT symbol, COUNT(*) AS count
         FROM trades
         WHERE politicianName = ?
         GROUP BY symbol
         ORDER BY count DESC`,
        [politicianName]
      );
      res.json(rows); 
    } catch (err) {
      console.error("Error fetching portfolio composition data:", err);
      res
        .status(500)
        .json({ error: "Failed to fetch portfolio composition data" });
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
