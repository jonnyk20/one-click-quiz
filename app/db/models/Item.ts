import { Model, Column, Table, BelongsTo } from "sequelize-typescript";
import ItemType from "./ItemType";

@Table
class Item extends Model {
  @BelongsTo(() => ItemType, "itemTypeId")
  itemType!: ItemType;

  data!: JSON;
}

export default Item;
