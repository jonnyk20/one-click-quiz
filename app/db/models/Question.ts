import { Model, Column, Table, BelongsTo, HasMany } from "sequelize-typescript";
import Quiz from "./Quiz";
import Choice from "./Choice";

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
