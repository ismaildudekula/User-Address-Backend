const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

User.associate = (models) => {
    User.hasMany(models.Address, {
        foreignKey: 'userId',
        as: 'addresses'
    });
};

module.exports = User;
