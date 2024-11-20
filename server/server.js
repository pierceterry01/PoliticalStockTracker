require('dotenv').config();
const bcrypt = require('bcryptjs');
const cors = require('cors');
const express = require('express');
const { body, validationResult } = require('express-validator');
const mysql = require('mysql2/promise');
const axios = require('axios');
const cron = require('node-cron');

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
        'TSLA', 'NVDA', 'AMZN', 'AAPL', 'MSFT', 'NFLX', 'DIS', 'PYPL',
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

// Start the server
app.listen(PORT, () => {
    console.log(`Backend server listening on port ${PORT}`);
});