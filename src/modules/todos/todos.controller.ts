import { TodosService, TodosSearchFilter } from "./todos.module";
import { TodosDocument } from "../../database/models/todos.model";
import { logger } from "../../common/utils/logger";

export class TodosController {
	private todosService: TodosService;

	constructor(todosService: TodosService) {
		this.todosService = todosService;
	}

	public createTodo = async (
		data: Partial<TodosDocument>
	): Promise<TodosDocument> => {
		
		return await this.todosService.create(data);
	};

	public createMultipleTodos = async (
		todos: Partial<TodosDocument>[]
	): Promise<TodosDocument[]> => {
		return await Promise.all(
			todos.map((todo) => this.todosService.create(todo))
		);
	};

	public getTodos = async (): Promise<TodosDocument[]> => {
		return await this.todosService.getAll();
	};

	public getTodoByQuery = async (
		query: Record<string, any>
	): Promise<TodosDocument | null> => {
		return await this.todosService.getByQuery(query);
	};

	public getTodosByQuery = async (
		query: Record<string, any>
	): Promise<TodosDocument[]> => {
		return await this.todosService.getManyByQuery(query);
	};

	public getTodoById = async (id: string): Promise<TodosDocument | null> => {
		return await this.todosService.getById(id);
	};

	public getTodosByLabel = async (label: string): Promise<TodosDocument[]> => {
		return await this.todosService.getByLabel(label);
	};

	public updateTodo = async (
		id: string,
		data: Partial<TodosDocument>
	): Promise<TodosDocument | null> => {
		data.updatedAt = new Date();
		return await this.todosService.update(id, data);
	};

	public deleteTodo = async (id: string): Promise<TodosDocument | null> => {
		return await this.todosService.delete(id);
	};

	public deleteTodosByQuery = async (
		query: Record<string, any>
	): Promise<any> => {
		return await this.todosService.deleteMatching(query);
	};

	public searchTodos = async (
		filter: TodosSearchFilter
	): Promise<TodosDocument[]> => {
		return await this.todosService.search(filter);
	};

	public updateMatchingTodos = async (
		filter: TodosSearchFilter,
		update: Partial<TodosDocument>
	): Promise<any> => {
		return await this.todosService.updateMatching(filter, update);
	};
}
