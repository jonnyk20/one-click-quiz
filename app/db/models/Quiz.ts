import {
  Model,
  Column,
  Table,
  BelongsTo,
  HasMany,
  Scopes,
  DefaultScope
} from "sequelize-typescript";
import QuizType from "./QuizType";
import Question from "./Question";

@DefaultScope(() => ({
  attributes: ["id", "name"],
  include: [Question]
}))
@Table
class Quiz extends Model<Quiz> {
  @Column
  name?: string;

  @Column
  url?: string;

  @BelongsTo(() => QuizType, "quizTypeId")
  quizType!: QuizType;

  @HasMany(() => Question, "quizId")
  questions?: Question[];
}

export default Quiz;
