import { Model, Column, Table, HasMany } from "sequelize-typescript";
import Quiz from "./Quiz";

@Table
class QuizType extends Model {
  @Column
  name!: string;

  @HasMany(() => Quiz, "quizTypeId")
  quizzes?: Quiz[];
}

export default QuizType;
