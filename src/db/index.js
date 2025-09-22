// db/index.js
import dotenv from "dotenv";
import mysql from "mysql2/promise";
import { DB_NAME } from "../constants.js";
import logger from "../logger/winston.logger.js";

dotenv.config({
  path: "./.env",
});

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  database: DB_NAME,
  password: process.env.MYSQL_PASSWORD,
  port: process.env.MYSQL_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query("SELECT NOW() AS now");
    // console.log("✅ MySQL connected successfully at:", rows[0].now);
    logger.info(
        `\n☘️  MySQL connected successfully at: ${rows[0].now}\n`
      );
    connection.release();
  } catch (error) {
    logger.error("❌ MySQL connection error:", error);
    throw error;
  }
};

export { connectDB, pool };
