'use strict';
module.exports = (sequelize, DataTypes) => {
  const ItemType = sequelize.define('ItemType', {
    name: DataTypes.STRING
  }, {});
  ItemType.associate = function(models) {
    // associations can be defined here
  };
  return ItemType;
};