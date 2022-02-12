'use strict';
module.exports = (sequelize, DataTypes) => {
  const Notice = sequelize.define('Notice', {
    roomName: DataTypes.STRING,
    isRead: DataTypes.BOOLEAN,
    TweetId: DataTypes.INTEGER,
    ReplyId: DataTypes.INTEGER,
    LikeId: DataTypes.INTEGER,
    // FollowshipId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {});
  Notice.associate = function(models) {
    // associations can be defined here
    Notice.belongsTo(models.User)
    Notice.belongsTo(models.Tweet)
    Notice.belongsTo(models.Reply)
    Notice.belongsTo(models.Like)
    // Notice.belongsTo(models.Followship)
  };
  return Notice;
};