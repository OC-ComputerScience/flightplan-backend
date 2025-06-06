import dbConfig from "../config/db.config.js";
import Sequelize from "sequelize";

const SequelizeConfig = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
    logging: false, // Enable SQL query logging
  },
);

export default SequelizeConfig;
