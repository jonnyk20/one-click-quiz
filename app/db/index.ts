import fs from "fs";
import path from "path";
import { Sequelize } from "sequelize-typescript";
import configs from "./config/config";
import QuizType from "./models/QuizType";
import Quiz from "./models/Quiz";
import ItemType from "./models/ItemType";
import Question from "./models/Question";
import Choice from "./models/Choice";
import Item from "./models/Item";

const basename = path.basename(__filename);

type environmentType = "development" | "test" | "production";
const env: string = process.env.NODE_ENV || "development";

let envType: environmentType = "development";

switch (env) {
  case "test":
    envType = "test";
    break;
  case "production":
    envType = "production";
    break;
  default:
    break;
}

const config: any = configs[envType];

const db: any = {};

let sequelize: Sequelize;

const custom: any = process.env[config.use_env_variable];

if (config.use_env_variable) {
  sequelize = new Sequelize(custom, config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

sequelize.addModels([QuizType, Quiz, ItemType, Item, Question, Choice]);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
