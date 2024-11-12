require('dotenv').config();
const bcrypt = require('bcryptjs');
const cors = require('cors');
const express = require('express');
const { body, validationResult } = require('express-validator');
const mysql = require('mysql2/promise');
const axios = require('axios');

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

// Assign each stock symbol to their respective sector
const sectorMapping = {
    "AAPL": "Information Technology",
    "MSFT": "Information Technology",
    "GOOGL": "Communications Services",
    "TSLA": "Consumer Discretionary",
    "NVDA": "Information Technology",
    "AMZN": "Consumer Discretionary",
    "META": "Communications Services",
    "NFLX": "Communications Services",
    "BRK.B": "Financials",
    "V": "Financials",
    "JPM": "Financials",
    "JNJ": "Health Care",
    "PG": "Consumer Staples",
    "DIS": "Communications Services",
    "XOM": "Energy",
    "KO": "Consumer Staples",
    "PEP": "Consumer Staples",
    "BA": "Industrials",
    "INTC": "Information Technology",
    "CSCO": "Information Technology",
    "VZ": "Communications Services",
    "PFE": "Health Care",
    "UNH": "Health Care",
    "WMT": "Consumer Staples",
    "MA": "Financials",
    "HD": "Consumer Discretionary",
    "BABA": "Consumer Discretionary",
    "PYPL": "Financials",
    "ORCL": "Information Technology",
    "ADBE": "Information Technology",
    "CAT": "Industrials",
    "BX": "Financials",
    "LIN": "Materials",
    "SHW": "Materials",
    "BSND": "Materials",
    "MLM": "Materials",
    "PLD": "Real Estate",
    "AMT": "Real Estate",
    "EQIX": "Real Estate",
    "WELL": "Real Estate",
    "SPG": "Real Estate",
    "PSA": "Real Estate",
    "ETR": "Utilities",
    "CEG": "Utilities",
    "GEV": "Utilities",
    "AWK": "Utilities",
    "ATO": "Utilities",
    "TLN": "Utilities",
    "CVX": "Energy",
    "COP": "Energy",
    "TXGE": "Energy",
    "EOG": "Energy"
  }

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
app.get('/api/congressional-trading/symbols', async (req, res) => {
    const symbols = [
        "AAPL", "MSFT", "GOOGL", "TSLA", "NVDA",
      ]; // Add symbols to be inserted into the db
    const trades = [];
    // Stock Sectors


  

    const fetchTradesForSymbol = async (symbol) => {
        try {
            const response = await axios.get('https://finnhub.io/api/v1/stock/congressional-trading', {
                params: {
                    symbol,
                    token: FINNHUB_API_KEY,
                    from: '2024-01-01',
                    to: '2024-12-31'
                }
            });
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

    res.status(200).send('Trades for all symbols added to the database.');
});

// Route to retrieve the latest 100 trades from the database
app.get('/api/trades', async (req, res) => {
    try {
        console.log("Fetching the latest 100 trades from the database...");

        const [results] = await pool.query('SELECT * FROM trades ORDER BY transactionDate DESC LIMIT 100');

        console.log("Trades fetched from the database:", results);
        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching trades:', error.message);
        res.status(500).json({ error: 'Failed to fetch trades from the database' });
    }
});

// Route to get the sectory activity based on stock symbols
// (Change eventually to be portfolio specific)
app.get('/api/sector-activity', async (req, res) => {
    try {
        // Query database to get symbols (assuming it works)
        const [trades] = await pool.query('SELECT symbol FROM trades ORDER BY transactionDate DESC LIMIT 100');

        // Object to store sector counts
        const sectorCounts = {};

        // Loop through the trades and map each symbol to its respective sector
        trades.forEach(trade => {
            const sector = sectorMapping[trade.symbol];
            if (sector) {
                if (!sectorCounts[sector]) {
                    sectorCounts[sector] = 0;  
                }
                sectorCounts[sector]++;  
            }
        });

        // Convert sectorCounts to an array for charting purposes
        const sectorData = Object.keys(sectorCounts).map(sector => ({
            sector: sector,       
            count: sectorCounts[sector]  
        }));

        // Send sector counts data along with sector data in the response
        res.status(200).json({
            sectorCounts: sectorCounts,  
            sectorData: sectorData     
        });

    } catch (error) {
        console.error('Error fetching sector activity data:', error.message);
        res.status(500).json({ error: 'Failed to fetch sector activity data' });
    }
});

// Route to get portfolio stock composition based on stock symbols
// (Change eventually to be portfolio specific)
app.get('/api/portfolio-composition', async (req, res) => {
    try {
        // Query database to get all stock symbols in the portfolio
        const [trades] = await pool.query('SELECT symbol FROM trades ORDER BY transactionDate DESC LIMIT 100');

        // Object to store symbol counts
        const symbolCounts = {};

        // Count each symbol
        trades.forEach(trade => {
            const symbol = trade.symbol;
            if (!symbolCounts[symbol]) {
                symbolCounts[symbol] = 0;  
            }
            symbolCounts[symbol]++;  
        });

        // Format the data as an array for the frontend
        const data = Object.keys(symbolCounts).map(symbol => ({
            symbol,
            count: symbolCounts[symbol],
        }));

        res.json(data);
    } catch (error) {
        console.error("Error fetching portfolio composition data:", error);
        res.status(500).json({ error: "An error occurred while fetching portfolio composition data." });
    }
});
// Start the server
app.listen(PORT, () => {
    console.log(`Backend server listening on port ${PORT}`);
});