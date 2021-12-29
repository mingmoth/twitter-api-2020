'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING(50),
    email: DataTypes.STRING,
    account: DataTypes.STRING,
    password: DataTypes.STRING,
    avatar: DataTypes.STRING,
    cover: DataTypes.STRING,
    introduction: DataTypes.TEXT(160),
    role: DataTypes.STRING,
  }, {});
  User.associate = function (models) {
  };
  // class User extends Model {
  //   static associate(models) {
  //     // define association here
  //   }
  // };
  // User.init({
  //   name: DataTypes.STRING,
  //   email: DataTypes.STRING,
  //   account: DataTypes.STRING,
  //   password: DataTypes.STRING,
  //   avatar: DataTypes.STRING,
  //   cover: DataTypes.STRING,
  //   introduction: DataTypes.TEXT,
  //   role: DataTypes.STRING,
  // }, {
  //   sequelize,
  //   modelName: 'User'
  // })
  return User
}