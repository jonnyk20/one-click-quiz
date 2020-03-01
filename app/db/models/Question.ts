import {
  Model,
  Column,
  Table,
  BelongsTo,
  HasMany,
  DefaultScope
} from "sequelize-typescript";
import Quiz from "./Quiz";
import Choice from "./Choice";

@DefaultScope(() => ({
  attributes: ["id", "correctAnswerIndex"],
  include: [Choice]
}))
@Table
class Question extends Model {
  @Column
  correctAnswerIndex!: number;

  @BelongsTo(() => Quiz, "quizId")
  quiz!: Quiz;

  @HasMany(() => Choice, "questionId")
  choices!: Choice[];
}

export default Question;
