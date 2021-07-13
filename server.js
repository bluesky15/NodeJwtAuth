const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
//const dbhelper = require('./dbhelper')
const sequelize = require('./database');
const User = require('./User');


sequelize.sync().then(() => console.log('db is ready'));



const app = express();
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

const secretKey = 'kdjkjkei90ew0er0';
const expiryTime = 1000 * 10 + 's';


app.use('/static', express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

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

app.post('/api/login', async (req, res) => {
    const users = await User.findAll();
    const user = users.filter(e => e.username === req.body.username)
    if (user && user.length > 0) {
        const localUser = {
            "userName": user[0].userName,
            "userEmail": user[0].userEmail
        }
        delete localUser.password
        if (user[0].password === req.body.password) {
            jwt.sign({
                localUser
            }, secretKey, { expiresIn: expiryTime }, (err, token) => {
                res.json({
                    token
                });
            });
        } else {
            res.send(401)
        }
    }
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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server started on port ' + PORT));