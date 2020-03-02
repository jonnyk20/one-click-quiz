import {
  Model,
  Column,
  Table,
  BelongsTo,
  DefaultScope,
  DataType,
  ForeignKey
} from "sequelize-typescript";
import ItemType from "./ItemType";

@DefaultScope(() => ({
  attributes: ["id", "data"]
}))
@Table
class Item extends Model {
  @ForeignKey(() => ItemType)
  @Column
  itemTypeId!: number;

  @BelongsTo(() => ItemType, "itemTypeId")
  itemType!: ItemType;

  @Column(DataType.JSON)
  data!: any;
}

export default Item;
