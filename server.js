const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const secretKey = 'kdjkjkei90ew0er0';
const expiryTime = 1000 * 10 + 's';

app.get('/api', (req, res) => {
    res.json({
        message: 'welcome to the API'
    });
})

app.post('/api/posts', verifyToken, (req, res) => {
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

app.post('/api/login', (req, res) => {
    // Mock user
    const user = {
        id: 1,
        username: 'lkb',
        email: 'lkb@gmail.com'
    }
    jwt.sign({
        user
    }, secretKey, {expiresIn: expiryTime}, (err, token) => {
        res.json({
            token
        });
    });
});

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
app.listen(3000, () => console.log('Server started on port 3000'));