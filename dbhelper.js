const sequelize = require('./database');
const User = require('./User');

sequelize.sync().then(() => console.log('db is ready'));

const users = async () =>{
return await User.findAll();
};

module.exports = users