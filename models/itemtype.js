"use strict";
module.exports = (sequelize, DataTypes) => {
  const ItemType = sequelize.define(
    "ItemType",
    {
      name: DataTypes.STRING
    },
    {}
  );
  ItemType.associate = function(models) {
    ItemType.hasMany(models.Item, { foreignKey: "itemTypeId" });
  };
  return ItemType;
};
