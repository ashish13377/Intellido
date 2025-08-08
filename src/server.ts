import "dotenv/config";

import { TodosController } from "./modules/todos/todos.controller";
import { TodosService } from "./modules/todos/todos.module";
import { ProjectController } from "./modules/project/project.controller";
import { ProjectService } from "./modules/project/project.module";
import { SubTodosController } from "./modules/subTodos/subTodos.controller";
import { SubTodosService } from "./modules/subTodos/subTodos.module";
import connectDatabase from "./database/database";
import readlineSync from "readline-sync";
import OpenAI from "openai";
import { logger } from "./common/utils/logger";
import si from "systeminformation";
import chalk from "chalk";
import cliSpinners from "cli-spinners";
import ora from "ora";
const os = require("os");
const ip = require("ip");

const client = new OpenAI();
// const client = new OpenAI({
// 	baseURL: "http://localhost:11434/v1", // Pointing to Ollama's local API
// 	apiKey: "ollama", // Required by the OpenAI SDK, but Ollama doesn’t validate it 
// });

let isInfoShow = false;
let isStart = false;

const APP_NAME = "Intellido";
const DESCRIPTION =
	"Revolutionizing Productivity: Your AI-Powered To-Do Companion! 🚀";
const VERSION = "2.1.0";
const MAIN = "server.ts";
const COPYRIGHT = "(c) 2025, Intellido.fun";
const LOCAL_IP = ip.address();
const CPU = os.cpus()[0].model;
const RAM = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2) + " GB";

async function getGPUInfo() {
	try {
		const gpus = await si.graphics();
		return gpus.controllers.length > 0 ? gpus.controllers[0].model : "N/A";
	} catch (error: any) {
		logger.error(`Failed to retrieve GPU info: ${error.message}`);
		return "N/A";
	}
}

function formatOutput(cleanOutput: any) {
	const match = cleanOutput.match(
		/^(.+?):\s+(.*?)\.\s+(Would you like to .+\?)$/
	);
	if (!match) {
		return cleanOutput;
	}
	const [, prefix, tasksAndSuffix, finalQuestion] = match;
	let tasksText = tasksAndSuffix.replace(/\.\s*$/, "");
	const tasksArray = tasksText.split(/\s*,\s+(?:and\s+)?|\s+and\s+/);
	const enumeratedTasks = tasksArray
		.map((task: any, i: any) => `${i + 1}. ${task}`)
		.join(",\n");

	const formattedOutput = `${prefix}:

${enumeratedTasks}. 

${finalQuestion}`;

	return formattedOutput;
}

async function menuCheck(check: any, menu: any) {
	if (!check) {
		// Ensure it runs only if the chat hasn't started
		console.log(menu);
		const choice = readlineSync.question("Enter your choice: ");

		if (choice === "2") {
			console.log(chalk.red("👋 Exiting..."));
			process.exit(0);
		}

		if (choice !== "1") {
			console.log(chalk.red("❌ Invalid choice. Try again."));
			return menuCheck(check, menu); // Re-prompt user
		}

		isStart = true; // Mark chat as started so menu does not show again
	}
}
async function showWelcomeMessage(check: any) {
	if (!check) {
		const greetingSpinner = ora("🤖 Initializing...").start();
		await new Promise((resolve) => setTimeout(resolve, 2000)); // Ensures delay
		greetingSpinner.succeed("Assistant Ready!");

		console.log(
			chalk.green(
				"Hey! I am your AI assistant 🤖 Intellido. Ready to assist you with anything related to your Day-to-Day tasks!"
			)
		);
		console.log(chalk.yellow("Please enter your task:"));
	}
}

(async () => {
	const GPU = await getGPUInfo();

	const header = `
${chalk.blue(
	"┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓"
)}
${chalk.blue(
	"┃                                  APPLICATION STARTED                              ┃"
)}
${chalk.blue(
	"┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛"
)}
`;
	const infoTable = `
${chalk.green(
	"┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓"
)}
┃ App Name     : ${APP_NAME.padEnd(67)}┃
┃ Description  : ${DESCRIPTION.padEnd(67)}┃
┃ Version      : ${VERSION.padEnd(67)}┃
┃ Main         : ${MAIN.padEnd(67)}┃
┃ Copyright    : ${COPYRIGHT.padEnd(67)}┃
┃ Local IP     : ${LOCAL_IP.padEnd(67)}┃
┃ CPU          : ${CPU.padEnd(67)}┃
┃ RAM          : ${RAM.padEnd(67)}┃
┃ GPU          : ${GPU.padEnd(67)}┃
${chalk.green(
	"┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛"
)}
`;
	console.log(header + infoTable);

	const menu = `
${chalk.yellow("Select an option:")}
1️⃣  Start Chat
2️⃣  Exit
`;

	// First, connect to the database
	await connectDatabase();

	// Initialize service and controller instances
	const projectService = new ProjectService();
	const projectController = new ProjectController(projectService);
	const { getProjects, createProject } = projectController;

	const subTodosService = new SubTodosService();
	const subTodosController = new SubTodosController(subTodosService);
	const { createSubTodo, getSubTodos } = subTodosController;

	const todosService = new TodosService();
	const todosController = new TodosController(todosService);

	const {
		createTodo,
		createMultipleTodos,
		getTodos,
		updateMatchingTodos,
		deleteTodosByQuery,
		searchTodos,
	} = todosController;

	const tools: any = {
		createTodo: createTodo,
		createMultipleTodos: createMultipleTodos,
		getTodos: getTodos,
		searchTodos: searchTodos,
		updateMatchingTodos: updateMatchingTodos,
		deleteTodosByQuery: deleteTodosByQuery,
	};

const SYSTEM_PROMPT = `
AI To-Do Assistant. Operates in states: START → PLAN → ACTION → OBSERVATION → OUTPUT.  
All messages = JSON. Manage tasks only via the provided tools.

**Schema**
{
  _id: string,
  taskName: string,
  description: string,
  dueDate: Date,
  priority: number,
  isCompleted: boolean,
  type: string,
  label: string,
  createdAt: Date,
  updatedAt: Date
}

**Tools**
- createTodo(todo)
- createMultipleTodos(todos)
- getTodos()
- searchTodos(filter)
- updateMatchingTodos(filter, update)
- deleteTodosByQuery(query)

**Example: Birthday**
START: {"type":"user","user":"I want birthday party todos."}  
PLAN: {"type":"plan","plan":"Suggest party tasks."}  
OUTPUT: {"type":"output","output":"🎉 Suggestions: Order Cake, Send Invitations, Decorate Venue, Arrange Music. Add them?"}  
USER: {"type":"user","user":"Yes, label 'Birthday Party Event'."}  
ACTION: {"type":"action","function":"createMultipleTodos","input":[{ "taskName":"Order Cake", "label":"Birthday Party Event" }, ...]}  
OBS: {"type":"observation","observation":"Tasks added."}  
OUTPUT: {"type":"output","output":"✅ Added: Order Cake, Send Invitations, Decorate Venue, Arrange Music."}

**Example: Travel**
USER: {"type":"user","user":"Create 'Buy Flights Tickets to Bali' label 'Travel to Bali'."}  
ACTION: {"type":"action","function":"createTodo","input":{ "taskName":"Buy Flights Tickets to Bali", "label":"Travel to Bali" }}  
OBS: {"type":"observation","observation":"Added."}  
OUTPUT: {"type":"output","output":"✅ Task added."}  
USER: {"type":"user","user":"Show all 'Travel to Bali'."}  
ACTION: {"type":"action","function":"getTodos","input":{}}  
OBS: {"type":"observation","observation":"[...]"}  
OUTPUT: {"type":"output","output":"✈️ Buy Flights Tickets to Bali."}  
USER: {"type":"user","user":"Find 'Bali' tasks."}  
ACTION: {"type":"action","function":"searchTodos","input":{"searchTerm":"Bali"}}  
USER: {"type":"user","user":"Mark them complete."}  
ACTION: {"type":"action","function":"updateMatchingTodos","input":{"filter":{"searchTerm":"Bali"},"update":{"isCompleted":true}}}  
USER: {"type":"user","user":"Delete completed."}  
ACTION: {"type":"action","function":"deleteTodosByQuery","input":{"isCompleted":true}}
`;


	const messages = [{ role: "system", content: SYSTEM_PROMPT }];

	while (true) {
		try {

			await showWelcomeMessage(isInfoShow);
			await menuCheck(isStart, menu);

			const query = readlineSync.question(">> ");

			if (
				query === "exit" ||
				query === "quit" ||
				query === "q" ||
				query === "bye" ||
				query === "stop" ||
				query === "end"
			) {
				console.log(chalk.red("👋 Exiting..."));
				process.exit(0);
			}

			isInfoShow = true;
			const userMessage = {
				type: "user",
				user: query,
			};
			messages.push({ role: "user", content: JSON.stringify(userMessage) });

			const spinner = ora({
				text: "🤖 Thinking...",
				spinner: cliSpinners.dots,
			}).start();

			while (true) {
				try {
					const chat = await client.chat.completions.create({
						model: "gpt-4o",
						// model: "deepseek-r1:7b",
						messages: messages as any,
						response_format: {
							type: "json_object",
						},
					});

					const response: any = chat.choices[0].message.content;
					messages.push({ role: "assistant", content: response });

					const action = JSON.parse(response);
					if (action.type === "output") {
						// const formattedOutput = action.output
						// 	.replace(/, (\d+\.)/g, ",\n$1")
						// 	.replace(/, and (\d+\.)/g, ",\n$1");
						const formattedOutput = formatOutput(action.output);
						spinner.stop();
						console.log(chalk.cyan(`🤖 >>  ${formattedOutput}\n`));
						break;
					} else if (action.type === "action") {
						const fn = tools[action.function];
						if (!tools[action.function]) {
							console.error(
								chalk.red(`❌ Function ${action.function} not recognized.`)
							);
							continue;
						}

						const observation = await fn(action.input);
						const observationMessage = {
							type: "observation",
							observation: observation,
						};
						messages.push({
							role: "developer",
							content: JSON.stringify(observationMessage),
						});
					}
				} catch (error: any) {
					spinner.stop();
					logger.error(`Inner loop error: ${error.message}`, { error });
					console.error(
						chalk.red("❌ An error occurred. Check the logs for details.")
					);
					break;
				}
			}
		} catch (error: any) {
			logger.error(error.message);
			console.error(
				chalk.red("❌ An error occurred. Check the logs for details.")
			);
			break;
		}
	}
})();
