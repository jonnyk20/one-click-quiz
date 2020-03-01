"use strict";
module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define(
    "Item",
    {
      data: DataTypes.JSON
    },
    {}
  );
  Item.associate = function(models) {
    Item.belongsTo(models.ItemType, { foreignKey: "itemTypeId" });
  };
  return Item;
};
