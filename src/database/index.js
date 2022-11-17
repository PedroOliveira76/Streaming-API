const User = require('../models/User');
const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const connection = new Sequelize(dbConfig);

User.init(connection);

module.exports = connection;