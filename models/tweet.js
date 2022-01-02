'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    description: DataTypes.TEXT(160),
    UserId: DataTypes.INTEGER
  }, {});
  Tweet.associate = function(models) {
  };
  return Tweet;
};