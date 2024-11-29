require('dotenv').config();
const bcrypt = require('bcryptjs');
const cors = require('cors');
const express = require('express');
const { body, validationResult } = require('express-validator');
const mysql = require('mysql2/promise');
const axios = require('axios');
const cron = require('node-cron');
const portfolioRoutes = require('./routes/portfolioRoutes');


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const serverPort = process.env.PORT || 3001;
const PORT = serverPort;
const databasePort = 3306;
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

const corsOptions = {
    origin: 'http://localhost:3000',
    allowedHeaders: ['Content-Type', 'Authorization'],
};

// TODO: CHANGE FOR PRODUCTION
const secret = process.env.JWT_SECRET;

app.use(cors(corsOptions));

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: databasePort,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

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

// Validate the registration info.
const registerValidator = [
    body('user.username', 'Username field cannot be empty.').not().isEmpty(),
    body('user.username', 'Username must be between 2 and 40 characters long.').isLength({min: 2, max: 40}),
    body('user.username', 'Username cannot start with an underscore, period, or dash.').not().matches(/^[-_\.]/),
    body('user.username', 'Username may only contain alphanumeric characters, underscores, dashes, or periods.').matches(/^[A-Za-z\d-_\.]+$/),
    body('user.email', 'Email field cannot be empty.').not().isEmpty(),
    body('user.email', 'Email must be a valid email address.').isEmail(),
    body('user.password', 'Password field cannot be empty.').not().isEmpty(),
    body('user.password', 'Password must be between 8 and 72 characters in length.').isLength({min: 8,max: 72 }),
    // Check if the password is the same as the confirm password field
    body('user.password').custom((value, { req }) => {
        if (value !== req.body.user.confirmPassword) {
            throw new Error("Passwords must match.");
        }
        return true;
    })
];

const loginValidator = [
    body('user.username', 'Username field cannot be empty.').not().isEmpty(),
    body('user.password', 'Password field cannot be empty.').not().isEmpty(),
];

app.post('/auth/register', registerValidator, async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        const user = req.body.user;

        try {
            const hash = await bcrypt.hash(user.password, 16);
            await pool.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                [user.username, user.email, hash]);
            res.status(200).send();
        } catch (err) {
            console.error(err);
            res.status(400).send();
        }
    } else {
        res.status(422).json({ errors: errors.array() });
    }
});

app.post('/auth/login', loginValidator, async (req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        try {
            const [rows] = await pool.execute('SELECT id, password FROM users WHERE username = ?', [req.body.user.username]);
            if (rows.length === 0) {
                return res.status(422).send();
            }

            const user = rows[0];
            const match = await bcrypt.compare(req.body.user.password, user.password);

            if (match) {
                const jwt = require('jsonwebtoken');
                const token = jwt.sign({ username: req.body.user.username, id: user.id }, secret);
                res.status(200).json({ token: token });
            } else {
                res.status(401).send();
            }
        } catch (err) {
            console.error(err);
            res.status(500).send();
        }
    } else {
        res.status(422).json({ errors: errors.array()});
    }
});

app.post('/auth', async (req, res) => {
    if (!req.headers["x-auth"]) {
        return res.status(401).send();
    }

    const token = req.headers["x-auth"];
    try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, secret);
        res.status(200).json(decoded);
    } catch (err) {
        console.error(err);
        res.status(401).send();
    }
});

const fetchTradesAndUpdateDB = async () => {
    const symbols = [
        'WFC','TSLA', 'NVDA', 'AMZN', 'AAPL', 'MSFT', 'NFLX', 'DIS', 'PYPL',
        'GOOGL', 'META', 'BABA', 'JPM', 'V', 'MA', 'UNH', 'HD',
        'PG', 'VZ', 'KO', 'PEP', 'CSCO', 'INTC', 'XOM', 'BA',
        'GE', 'WMT', 'BAC', 'C', 'GS', 'MRK', 'T', 'IBM',
        'PFE', 'ABT', 'CVX', 'MMM', 'HON', 'CAT', 'NKE', 'ORCL',
        'ADBE', 'AMD', 'SBUX', 'MCD', 'LLY', 'CRM', 'WFC', 'COST',
        'CMCSA', 'QCOM', 'UPS', 'RTX', 'BMY', 'SPGI', 'AVGO', 'TXN',
        'MO', 'MDLZ', 'NEE', 'LIN', 'LOW', 'BK', 'BLK', 'AXP',
        'DUK', 'AMT', 'PLD', 'TGT', 'CCI', 'FDX', 'AEP', 'GILD',
        'GM', 'F', 'EBAY', 'ROKU', 'ZM', 'SNOW', 'SQ', 'SHOP',
        'TWLO', 'FIS', 'FISV', 'HPE', 'MU', 'SIVB', 'DOCU', 'ATVI',
        'TTD', 'MTCH', 'U', 'RBLX', 'PINS', 'ETSY', 'LYFT', 'UBER',
        'DAL', 'UAL', 'RCL', 'MAR', 'NCLH', 'WYNN', 'MGM', 'BRK.B',
        'JNJ', 'TMO', 'MS', 'USB', 'AMGN', 'CVS', 'ABBV', 'MDT',
        'DHR', 'ISRG', 'SYK', 'ZTS', 'CI', 'ANTM', 'HUM', 'ELV',
        'MOH', 'CNC', 'UNP', 'CSX', 'NSC', 'LMT', 'GD', 'NOC',
        'ITW', 'EMR', 'ETN', 'ROK', 'DOV', 'PH', 'CMI', 'PCAR',
        'DE', 'PWR', 'JCI', 'XYL', 'NUE', 'STLD', 'CLF', 'FCX',
        'NEM', 'GOLD', 'FNV', 'WPM', 'RGLD', 'AEM', 'NTR', 'MOS',
        'CF', 'ADM', 'BG', 'TSN', 'HRL', 'CAG', 'K', 'GIS',
        'CPB', 'SJM', 'HSY', 'MKC', 'CHD', 'CL', 'KMB', 'EL',
        'CLX', 'UL', 'RBGLY', 'NSRGY', 'MNST', 'KDP', 'STZ', 'BF.B',
        'DEO', 'BUD', 'TAP', 'SAM', 'PM', 'BTI', 'IMBBY', 'UVV'
    ];
        const trades = [];

    const fetchTradesForSymbol = async (symbol) => {
        try {
            const response = await axios.get('https://finnhub.io/api/v1/stock/congressional-trading', {
                params: {
                    symbol,
                    token: FINNHUB_API_KEY,
                    from: '2020-01-01',
                    to: '2024-12-31'
                }
            });
            console.log(`Data fetched for ${symbol}:`, response.data);
            return response.data.data;
        } catch (error) {
            console.error(`Error fetching trades for ${symbol}:`, error.message);
            return null;
        }
    };

    const fetchTradesInBatches = async () => {
        for (const symbol of symbols) {
            const symbolTrades = await fetchTradesForSymbol(symbol);
            if (symbolTrades) {
                trades.push(...symbolTrades);
            }
            await new Promise((resolve) => setTimeout(resolve, 200)); // Delay between each symbol request
        }
    };

    await fetchTradesInBatches();

    // Insert all trades into the database
    for (const transaction of trades) {
        const { transactionDate, transactionType, amountFrom, amountTo, assetName, filingDate, name: politicianName, ownerType, position } = transaction;

        const sql = `INSERT INTO trades (symbol, transactionDate, transactionType, amountFrom, amountTo, assetName, filingDate, politicianName, ownerType, position)
                     SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
                     WHERE NOT EXISTS (
                         SELECT 1 FROM trades WHERE symbol = ? AND transactionDate = ? AND transactionType = ? AND politicianName = ?
                     )`;

        try {
            await pool.execute(sql, [
                transaction.symbol || null, transactionDate || null, transactionType || null,
                amountFrom || null, amountTo || null, assetName || null, filingDate || null,
                politicianName || null, ownerType || null, position || null, transaction.symbol || null,
                transactionDate || null, transactionType || null, politicianName || null
            ]);
        } catch (insertError) {
            console.error("Error inserting transaction:", insertError.message);
        }
    }
};

// Route to trigger fetching trades manually
app.get('/api/congressional-trading/symbols', async (req, res) => {
    await fetchTradesAndUpdateDB();
    res.status(200).send('Trades for all symbols added to the database.');
});

// Schedule the fetch to run every 5 minutes
cron.schedule('*/5 * * * *', async () => {
    console.log("Running scheduled task to fetch trades...");
    await fetchTradesAndUpdateDB();
});

// Route to retrieve the latest 100 trades from the database
app.get('/api/trades', async (req, res) => {
    try {
        console.log("Fetching the latest 100 trades from the database...");

        const [results] = await pool.query('SELECT * FROM trades ORDER BY transactionDate DESC LIMIT 100');

        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching trades:', error.message);
        res.status(500).json({ error: 'Failed to fetch trades from the database' });
    }
});

// Route to retrieve trades for a specific politician
app.get('/api/trades/politician', async (req, res) => {
    const { politicianName } = req.query;

    if (!politicianName) {
        return res.status(400).json({ error: 'Politician name is required' });
    }

    try {
        console.log(`Fetching trades for politician: ${politicianName}`);
        const [results] = await pool.query(
            'SELECT * FROM trades WHERE politicianName = ? ORDER BY transactionDate DESC LIMIT 100',
            [politicianName]
        );
        console.log("Trades fetched from the database:", results);
        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching trades for politician:', error.message);
        res.status(500).json({ error: 'Failed to fetch trades from the database' });
    }
});

// Data Visualization
// Route to get portfolio stock composition 
// Counts the stock symbols for the given poltician
app.get('/api/portfolio-composition', async (req, res) => {
    const { politicianName } = req.query;

    try {
        // Query trades that adjusts for the selected politician page
        const [trades] = await pool.query(`
            SELECT symbol 
            FROM trades
            WHERE politicianName = ?
            ORDER BY transactionDate DESC 
        `, [politicianName]);

        // Object to store the symbol counts
        const symbolCounts = {};

        // Count each symbol that's retrieved
        trades.forEach((trade) => {
            const symbol = trade.symbol;
            if (!symbolCounts[symbol]) {
                symbolCounts[symbol] = 0;
            }
            symbolCounts[symbol]++;
        });

        // Convert the count object to an array 
        // sort by the count in descending order
        const sortedData = Object.keys(symbolCounts)
            .map((symbol) => ({
                symbol,
                count: symbolCounts[symbol],
            }))
            .sort((a, b) => b.count - a.count); 

        // Get the top 5 stock symbols with the most trades
        const topSymbols = sortedData.slice(0, 5);

        res.json(topSymbols);
    } catch (error) {
        res.status(500).json({ error: "An error has occurred when attempting to retrieve the portfolio stock composition data." });
    }
});

// Route to obtain the sector activity data
// Each symbol is assigned to their respective stock sector using the sectorMapping array
app.get('/api/sector-activity', async (req, res) => {
    const { politicianName } = req.query;
    try {
        const [trades] = await pool.query(`
            SELECT symbol 
            FROM trades
            WHERE politicianName = ?
            ORDER BY transactionDate DESC 
        `, [politicianName]);

        // Object to store the sector counts
        const sectorCounts = {};

        // Loop through the retrieved trades and map each symbol to its respective sector
        trades.forEach(trade => {
            const sector = sectorMapping[trade.symbol];
            if (sector) {
                if (!sectorCounts[sector]) {
                    sectorCounts[sector] = 0;  
                }
                sectorCounts[sector]++;  
            }
        });

        // Reformat sectorCounts for charting
        const sectorData = Object.keys(sectorCounts).map(sector => ({
            sector: sector,
            count: sectorCounts[sector]
        }));

        // Get the top 5 sectors
        const topSectors = sectorData.sort((a, b) => b.count - a.count).slice(0, 5);

        res.status(200).json({
            sectorCounts: sectorCounts,  
            sectorData: topSectors     
        });

    } catch (error) {
        res.status(500).json({ error: 'An error has occurred when attempting to retrieve the sector activity data' });
    }
});

// Route to obtain the trade volume data for the last 4 years, grouped by quarters
app.get('/api/trade-volume', async (req, res) => {
    try {
      const { politicianName } = req.query;
  
      // Get the current date and get the date from 4 years ago
      const endDate = moment().format('YYYY-MM-DD');
      const startDate = moment().subtract(4, 'years').startOf('year').format('YYYY-MM-DD');
  
      // Generate an array of quarters for the last 4 years (2021-2024, 4 quarters per year)
      const allQuarters = [];
      for (let year = moment().year(); year > moment().subtract(4, 'years').year(); year--) {
        for (let quarter = 1; quarter <= 4; quarter++) {
          allQuarters.push(`${year}-Q${quarter}`);
        }
      }
  
      // Query trades
      const [trades] = await pool.query(
        `SELECT transactionDate, transactionType, amountFrom, amountTo
         FROM trades
         WHERE politicianName = ? AND
         transactionDate BETWEEN ? AND ?
         ORDER BY transactionDate`,
        [politicianName, startDate, endDate]
      );
  
      const quarterlyData = {};
      allQuarters.forEach((quarter) => {
        quarterlyData[quarter] = { purchaseVolume: 0, saleVolume: 0, tradeCount: 0 };
      });
  
      // Process the trades and populate them into quarterlyData
      trades.forEach((trade) => {
        const quarter = moment(trade.transactionDate).quarter();
        const year = moment(trade.transactionDate).year();
        const quarterLabel = `${year}-Q${quarter}`;
  
        // Volume Calculation (amountFrom + amountTo) / 2
        // Represents a midpoint/estimate
        const amountFrom = parseFloat(trade.amountFrom);
        const amountTo = parseFloat(trade.amountTo);
        const volume = (amountFrom + amountTo) / 2;
  
        // Checks the transaction type and assigns it accordingly (purchase or sale)
        if (trade.transactionType === 'Purchase') {
          quarterlyData[quarterLabel].purchaseVolume += volume;
          // 3 types of sale trades present in the data, counting all three of them as a sale trade
        } else if (['Sale', 'Sale (Partial)', 'Sale (Full)'].includes(trade.transactionType)) {
          quarterlyData[quarterLabel].saleVolume += volume;
        }
  
        // Count total trades (Purchases and Sales)
        // For the line graph
        quarterlyData[quarterLabel].tradeCount += 1;
      });
  
      // Reformat the data for charting
      const result = allQuarters.map((quarter) => ({
        interval: quarter,
        purchaseVolume: quarterlyData[quarter].purchaseVolume,
        saleVolume: quarterlyData[quarter].saleVolume,
        tradeCount: quarterlyData[quarter].tradeCount,  // Total trade count
      }));
  
      // Handle if there is no trade data for a politician
      const hasTradeVolumeData = result.some(
        (entry) => entry.purchaseVolume > 0 || entry.saleVolume > 0 || entry.tradeCount > 0
      );
  
      if (!hasTradeVolumeData) {
        return res.status(200).json({ Volume: [] });
      }
  
      res.status(200).json({ data: result });
    } catch (error) {
      res.status(500).json({ error: 'An error has occurred when attempting to retrieve the trading volume data' });
    }
  });

  // Route to get the number of trades for a specific politician
app.get('/api/trade-count', async (req, res) => {
    const { politicianName } = req.query;

    try {
        // Query to count trades for the selected politician
        const [result] = await pool.query(`
            SELECT COUNT(*) AS tradeCount
            FROM trades
            WHERE politicianName = ?
        `, [politicianName]);

        const tradeCount = result[0].tradeCount;

        res.json({ politicianName, tradeCount });
    } catch (error) {
        res.status(500).json({ error: "An error has occurred when attempting to retrieve the trade count." });
    }
});

// Route to get the number of unique symbols for a specific politician
app.get('/api/issuer-count', async (req, res) => {
    const { politicianName } = req.query;

    try {
        // Query to count distinct symbols for the selected politician
        const [result] = await pool.query(`
            SELECT COUNT(DISTINCT symbol) AS issuerCount
            FROM trades
            WHERE politicianName = ?
        `, [politicianName]);

        const issuerCount = result[0].issuerCount;

        res.json({ politicianName, issuerCount });
    } catch (error) {
        res.status(500).json({ error: "An error has occurred when attempting to retrieve the unique symbol count." });
    }
});

app.use('/api', portfolioRoutes(pool)); 




// Start the server
app.listen(PORT, () => {
    console.log(`Backend server listening on port ${PORT}`);
});