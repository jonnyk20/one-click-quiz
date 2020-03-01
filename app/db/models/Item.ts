import {
  Model,
  Column,
  Table,
  BelongsTo,
  DefaultScope
} from "sequelize-typescript";
import ItemType from "./ItemType";

@DefaultScope(() => ({
  attributes: ["id", "data"]
}))
@Table
class Item extends Model {
  @BelongsTo(() => ItemType, "itemTypeId")
  itemType!: ItemType;

  data!: JSON;
}

export default Item;
