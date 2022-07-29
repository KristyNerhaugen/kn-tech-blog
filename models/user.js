const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

// User model
class User extends Model {}

User.init();

module.exports = User;
