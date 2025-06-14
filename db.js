const pgp = require("pg-promise")();
require("dotenv").config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable not set");
}

const db = pgp(connectionString);

module.exports = db;
