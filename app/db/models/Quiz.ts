import { Model, Column, Table, BelongsTo, HasMany } from "sequelize-typescript";
import QuizType from "./QuizType";
import Question from "./Question";

@Table
class Quiz extends Model<Quiz> {
  @BelongsTo(() => QuizType, "itemTypeId")
  quizType!: QuizType;

  @HasMany(() => Question, "quizId")
  questions!: Question[];
}

export default Quiz;
