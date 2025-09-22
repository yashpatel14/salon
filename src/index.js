// index.js
import dotenv from "dotenv";
import {connectDB} from "./db/index.js";
import { app } from "./app.js";
import logger from "./logger/winston.logger.js";

dotenv.config({ path: "./.env" });

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
        logger.info(`✅ Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    logger.error("❌ MySQL connection failed!", err);
    process.exit(1);
  });