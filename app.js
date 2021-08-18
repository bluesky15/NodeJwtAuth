const express = require('express');
const morgan = require('morgan');
const createError = require('http-errors');
require('dotenv').config()
require('./helpers/init_mongodb')
const jwt = require('jsonwebtoken');
const path = require('path');
const AuthRoute = require('./Routes/Auth.route')

const secretKey = 'kdjkjkei90ew0er0';
const expiryTime = 1000 * 10 + 's';
const {verifyAccessToken} = require('./helpers/jwt_helper')
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

app.use('/static', express.static(path.join(__dirname, 'public')))

app.get('/',verifyAccessToken, async (req, res) => {
    console.log(req.headers['authorization'])
    res.sendFile(__dirname + '/index.html')
})
app.use('/auth', AuthRoute)

app.get('/api', async (req, res) => {
    res.json({
        message: 'welcome to the API'
    });
})

app.post('/api/posts', verifyToken, async (req, res) => {
    jwt.verify(req.token, secretKey, (err, authData) => {
        if (err) {
            res.sendStatus(403);
            console.log(err);
        } else {
            res.json({
                message: 'Post created...',
                authData
            });
        }
    });

});

app.post('/api/login', async (req, res) => {
    // Mock user
    const user = {
        id: 1,
        username: 'lkb',
        email: 'lkb@gmail.com'
    }
    jwt.sign({
        user
    }, secretKey, { expiresIn: expiryTime }, (err, token) => {
        res.json({
            token
        });
    });
});

app.use(async (req, res, next) => {
    // const error = new Error("not found")
    // error.status = 404
    next(createError.NotFound())

})
app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        },
    })
})

function verifyToken(req, res, next) {
    // get auth header value
    const bearerHeader = req.headers['authorization'];
    // check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // set the token
        req.token = bearerToken;
        // next middleware
        next();
    } else {
        res.sendStatus(403);
    }
}
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server started on port ' + PORT));