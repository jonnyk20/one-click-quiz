import { Model, Column, Table, DataType } from 'sequelize-typescript';

@Table
class TaxaChallengeScore extends Model {
  @Column(DataType.JSON)
  data!: any;
}

export default TaxaChallengeScore;
