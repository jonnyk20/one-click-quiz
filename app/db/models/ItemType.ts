import { Model, Column, Table, HasMany } from "sequelize-typescript";
import Item from "./Item";

@Table
class ItemType extends Model {
  @Column
  name!: string;

  @HasMany(() => Item, "itemTypeId")
  items?: Item[];
}

export default ItemType;
