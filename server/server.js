const bcrypt = require('bcrypt');
const cors = require('cors');
const express = require('express');
const { body, validationResult } = require('express-validator')
const mysql = require('mysql2')

const app = express()

app.use(express.json());
app.use(express.urlencoded( { extended: false }))
app.use(cors());

const serverPort = 3001
const databasePort = 3306

const corsOptions = {
    origin: 'http://localhost:3000',
    allowedHeaders: ['Content-Type', 'Authorization'],
};

// TODO: CHANGE FOR PRODUCTION
const secret = 'somestring'; 

app.use(cors(corsOptions));

const pool = mysql.createPool({
    host:     'localhost',
    user:     'root',
    password: 'root', 
    database: 'stock-tracker-db', 
    port:     databasePort,
    rowsAsArray: true,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0
})

// Validate the registration info.
const registerValidator = [
    body('user.username', 'Username field cannot be empty.').not().isEmpty(),
    body('user.username', 'Username must be between 2 and 40 characters long.').isLength({min: 2, max: 40}),
    body('user.username', 'Username cannot start with an underscore, period, or dash.').not().matches(/^[-_\.]/),
    body('user.username', 'Username may only contain alphanumeric characters, underscores, dashes, or periods.').matches(/^[A-Za-z\d-_\.]+$/),
    body('user.email', 'Email field cannot be empty.').not().isEmpty(),
    body('user.email', 'Email must be a valid email address.').isEmail(),
    body('user.password', 'Password field cannot be empty.').not().isEmpty(),
    body('user.password', 'Password must be between 8 and 72 characters in length.').isLength({min: 8, max: 72}),
    
    // Check if the password is the same as the confirm password field
    body('user.password').custom((value, {req}) => {
        if(value !== req.body.user.confirmPassword) {
            throw new Error("Passwords must match.")
        } 
        return true;
    }),
    // Check if the username is already taken
    body('user.username').custom(async(value, {req}) => {
        await new Promise((resolve) => {
            pool.query('SELECT * FROM users WHERE username = ?', [value], (err, res) => {
                resolve(res);
            })
        })
        .then(res => {
            if(res.length != 0) {
                throw new Error("Username is already taken.");
            } else {
                return true;
            }
        })
        .catch(error => {
            console.log(error);
            throw error;
        });
    })
]

const loginValidator = [
    body('user.username', 'Username field cannot be empty.').not().isEmpty(),
    body('user.password', 'Password field cannot be empty.').not().isEmpty(),
]

app.post('/auth/register', registerValidator, async (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        const user = req.body.user
        
        await new Promise((resolve) => {
            // Hash the password and attempt to insert the user info into the database
            bcrypt.hash(user.password, 16).then(hash => {
                pool.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                       [user.username, user.email, hash], (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(400).send();
                }

                // If no errors, send 200 OK
                res.status(200).send();
                resolve(res);
                })
            })
            
        })
    } else {
        res.status(422).json({errors: errors.array()})
    }
});


app.post('/auth/login', loginValidator, async (req, res) => {
    const errors = validationResult(req);
    
    if(errors.isEmpty) {
        new Promise((resolve) => {
            pool.query('SELECT id, password FROM users WHERE username = ?', [req.body.user.username], (err, result) => {
                if(err) {
                    console.log('no user found')
                    res.status(422).send();
                } else {
                    var hashed_pass = result[0][1]
                    var uid = result[0][0]

                    if(result.lengh > 1) {
                        res.status(500).send();
                    }
                    bcrypt.compare(req.body.user.password, hashed_pass.toString(), function(err, result) {
                        console.log(err)
                        console.log(result)

                        if(err) {
                            res.status(401).send();
                        }
                        if(result) {
                            const token = jwt.encode({ username: req.body.user.username, id: uid }, secret);
                            res.status(200).json({ token: token });
                        } else {
                            res.status(401).send();
                        }
                    })
                }
            })
            resolve(res)
        })
        
    } else {
        res.status(422).json({errors: errors.array()})
    }
});

app.post('/auth', async (req, res) => {
    if(!req.headers["x-auth"]) {
        console.log("not found");
        return res.status(401).send();
    } 

    const token = req.headers["x-auth"];
    try {
        const decoded = jwt.decode(token, secret);
        res.status(200).json(decoded)
    } catch (err) {
        console.log(err);
        res.status(401).send();
    }
})

// Open the server
app.listen(serverPort, () => {
    console.log(`Backend server listening on port ${serverPort}`)
});