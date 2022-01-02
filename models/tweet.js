'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    description: DataTypes.TEXT(140),
    UserId: DataTypes.INTEGER
  }, {});
  Tweet.associate = function(models) {
    Tweet.belongsTo(models.User)
    Tweet.hasMany(models.Reply)
    Tweet.hasMany(models.Like)
  };
  return Tweet;
};