'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    message: DataTypes.STRING,
    isRead: DataTypes.BOOLEAN,
    UserId: DataTypes.INTEGER,
    roomName: DataTypes.STRING,
    type: DataTypes.STRING,
  }, {});
  Message.associate = function(models) {
    // associations can be defined here
    Message.belongsTo(models.User)
  };
  return Message;
};