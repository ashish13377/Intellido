import { getEnv } from "../common/utils/get-env";

const appConfig = () => ({
	NODE_ENV: getEnv("NODE_ENV", "development"),
	PORT: getEnv("PORT", "5000"),
	MONGO_URI: getEnv("MONGO_URI"),
});

export const config = appConfig();
