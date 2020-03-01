import {
  Model,
  Column,
  Table,
  BelongsTo,
  DefaultScope
} from "sequelize-typescript";
import Item from "./Item";
import Question from "./Question";

@DefaultScope(() => ({
  attributes: ["id"],
  include: [Item]
}))
@Table
class Choice extends Model {
  @BelongsTo(() => Question, "questionId")
  question!: Question;

  @BelongsTo(() => Item, "itemId")
  item!: Item;

  correctAnswerIndex!: number;
}

export default Choice;
