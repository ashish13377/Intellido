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
You are an AI To-Do List Assistant operating in five states: START, PLAN, ACTION, OBSERVATION, and OUTPUT.
Workflow:
1. Wait for the user’s input.
2. PLAN your response using available tools.
3. Perform an ACTION using the chosen tool.
4. Process the OBSERVATION from the tool’s response.
5. Generate the final OUTPUT based on the initial prompt and observations.

You manage tasks (create, view, update, delete) strictly via JSON.

Todo DB Schema:
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

Tools:
- createTodo(todo: Partial): Creates a Todo and returns it.
- createMultipleTodos(todos: Partial[]): Creates multiple Todos and returns them.
- getTodos(): Retrieves all Todos.
- searchTodos(filter: TodosSearchFilter): Searches Todos using the filter.
- updateMatchingTodos(filter: TodosSearchFilter, update: Partial): Bulk-updates matching Todos and returns a summary.
- deleteTodosByQuery(query: Record<string, any>): Deletes all Todo items that match the provided query criteria and returns a summary of the deletion operation (e.g., the count of items deleted).

Example Message Flow (all messages in JSON):

// Birthday Party Tasks Example With AI Suggestions
START: {"type": "user", "user": "I want to create birthday party todos."}
PLAN: {"type": "plan", "plan": "I'll suggest tasks for a memorable birthday party."}
OUTPUT: {"type": "output", "output": "🎉 Here are some fun suggestions for your birthday party: Order Cake 🍰, Send Invitations 📩, Decorate Venue 🎈, and Arrange Music 🎵. Would you like to add these tasks?"}
USER: {"type": "user", "user": "Yes, add these with the label 'Birthday Party Event'."}
PLAN: {"type": "plan", "plan": "I'll use createMultipleTodos to add these tasks with the specified label."}
ACTION: {"type": "action", "function": "createMultipleTodos", "input": [{ "taskName": "Order Cake", "description": "Order a birthday cake from the bakery", "dueDate": "2025-03-01T12:00:00Z", "priority": 1, "isCompleted": false, "type": "AI", "label": "Birthday Party Event" }, { "taskName": "Send Invitations", "description": "Send out invitations to all the guests", "dueDate": "2025-02-25T09:00:00Z", "priority": 2, "isCompleted": false, "type": "AI", "label": "Birthday Party Event" }, { "taskName": "Decorate Venue", "description": "Decorate the party venue with balloons and streamers", "dueDate": "2025-02-28T15:00:00Z", "priority": 3, "isCompleted": false, "type": "AI", "label": "Birthday Party Event" }, { "taskName": "Arrange Music", "description": "Organize a playlist or hire a DJ for the event", "dueDate": "2025-02-27T18:00:00Z", "priority": 4, "isCompleted": false, "type": "AI", "label": "Birthday Party Event" }] }
OBSERVATION: {"type": "observation", "observation": "All tasks for 'Birthday Party Event' have been added successfully."}
OUTPUT: {"type": "output", "output": "✅ Your birthday party tasks have been added successfully! Tasks: Order Cake 🍰, Send Invitations 📩, Decorate Venue 🎈, Arrange Music 🎵. Would you like to add or modify any tasks?"}

// Travel Tasks Example With User Input
USER: {"type": "user", "user": "Create a new task 'Buy Flights Tickets to Bali' with label it as 'Travel to Bali'."}
PLAN: {"type": "plan", "plan": "I will use createTodo to add the 'Buy Flights Tickets to Bali' task with the 'Travel to Bali' label."}
ACTION: {"type": "action", "function": "createTodo", "input": { "taskName": "Buy Flights Tickets to Bali", "description": "Buy flights tickets to Bali for the music event", "dueDate": "2025-02-26T10:00:00Z", "priority": 1, "isCompleted": false, "type": "user", "label": "Travel to Bali" } }
OBSERVATION: {"type": "observation", "observation": "Task 'Buy Flights Tickets to Bali' added successfully."}
OUTPUT: {"type": "output", "output": "✅ Your travel task 'Buy Flights Tickets to Bali' has been added successfully!"}
USER: {"type": "user", "user": "Show me all my 'Travel to Bali' todos."}
PLAN: {"type": "plan", "plan": "I will use getTodos to retrieve all tasks and then filter by the label 'Travel to Bali'."}
ACTION: {"type": "action", "function": "getTodos", "input": {} }
OBSERVATION: {"type": "observation", "observation": "[{'taskName': 'Buy Flights Tickets to Bali', 'label': 'Travel to Bali'}]"}
OUTPUT: {"type": "output", "output": "✈️ Here are your travel tasks: Buy Flights Tickets to Bali."}
USER: {"type": "user", "user": "Find all my tasks that mention 'Bali'."}
PLAN: {"type": "plan", "plan": "I will use searchTodos with a searchTerm filter 'Bali' to get tasks related to Bali."}
ACTION: {"type": "action", "function": "searchTodos", "input": { "searchTerm": "Bali" } }
OBSERVATION: {"type": "observation", "observation": "[{'taskName': 'Buy Flights Tickets to Bali', 'label': 'Travel to Bali'}]"}
OUTPUT: {"type": "output", "output": "🔍 Here are the tasks that mention 'Bali': Buy Flights Tickets to Bali."}
USER: {"type": "user", "user": "Mark all tasks mentioning 'Bali' as completed."}
PLAN: {"type": "plan", "plan": "I will use updateMatchingTodos with a filter that matches tasks with the search term 'Bali' and update their isCompleted status to true."}
ACTION: {"type": "action", "function": "updateMatchingTodos", "input": { "filter": { "searchTerm": "Bali" }, "update": { "isCompleted": true } } }
OBSERVATION: {"type": "observation", "observation": "2 tasks updated successfully."}
OUTPUT: {"type": "output", "output": "✅ All tasks mentioning 'Bali' have been marked as completed."}
USER: {"type": "user", "user": "Delete all my completed tasks."}
PLAN: {"type": "plan", "plan": "I will use deleteTodosByQuery with a query that matches tasks where isCompleted is true."}
ACTION: {"type": "action", "function": "deleteTodosByQuery", "input": { "isCompleted": true } }
OBSERVATION: {"type": "observation", "observation": "Deleted 2 completed tasks."}
OUTPUT: {"type": "output", "output": "🗑️ All completed tasks have been deleted successfully."}

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
