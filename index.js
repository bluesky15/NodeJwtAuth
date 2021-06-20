const express = require("express");
const sequelize = require('./database');
const User = require('./User');


sequelize.sync().then(() => console.log('db is ready'));

const app = express();
app.use(express.json());

app.post("/users", async (req, res) => {
    await User.create(req.body)
    res.send('user is inserted')
})

app.get('/users', async (req, res) => {
    const users = await User.findAll();
    res.send(users);
});
app.listen(3000, () => {
    console.log("app is running - port 3000")
});