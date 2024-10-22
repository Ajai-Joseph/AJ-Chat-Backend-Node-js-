require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME_DEV,
    host: "localhost",
    dialect: "postgres",
  } ,
  test: {
    username: process.env.DB_USERNAME_TEST,
    password: process.env.DB_PASSWORD_TEST,
    database: process.env.DB_NAME_DEV_TEST,
    host: "localhost",
    dialect: "postgres",
  },
  production: {
    username: process.env.DB_USERNAME_PROD,
    password: process.env.DB_PASSWORD_PROD,
    database: process.env.DB_NAME_DEV_PROD,
    host: "localhost",
    dialect: "postgres",
  },
};
