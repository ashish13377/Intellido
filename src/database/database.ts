import mongoose from "mongoose";
import { config } from "../config/app.config";
import { logger } from "../common/utils/logger";

const connectDatabase = async () => {
	try {
		const connection = await mongoose.connect(config.MONGO_URI);
		logger.info(`Database connected on host: ${connection.connection.host}`);
	} catch (error: any) {
		logger.error(`Connecting to database: ${error.message}`);
		process.exit(1);
	}
};

export default connectDatabase;
