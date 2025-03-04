import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";
import { config } from "../../config/app.config";

const levelColors: { [key: string]: string } = {
	error: "\x1b[31m", // Red
	warn: "\x1b[33m", // Yellow
	info: "\x1b[32m", // Green
	http: "\x1b[36m", // Cyan
	debug: "\x1b[34m", // Blue
};

const resetColor = "\x1b[0m";

// Custom format for console with colors
const consoleFormat = format.printf(({ level, message, timestamp }) => {
	const coloredTimestamp = `\x1b[47m ${timestamp} \x1b[0m`; // Light grey background
	const color = levelColors[level] || "\x1b[37m"; // Default to white if level not defined
	const coloredLevel = `${color}${level.toUpperCase()}\x1b[0m`;

	return `[ ${coloredTimestamp} ] |${coloredLevel}| : ${message}`;
});

const fileFormat = format.printf(({ level, message, timestamp }) => {
	return `[ ${timestamp} ] |${level.toUpperCase()}| : ${message}`;
});

export const logger = createLogger({
	level: config.NODE_ENV === "production" ? "info" : "debug",
	transports: [
		new transports.Console({
			format: format.combine(
				format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
				consoleFormat
			),
		}),

		new transports.DailyRotateFile({
			dirname: "logs",
			filename: "%DATE%_ai_agent.log",
			datePattern: "YYYY-MM-DD",
			maxSize: "20m",
			maxFiles: "14d",
			format: format.combine(
				format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
				fileFormat
			),
		}),
	],
});
