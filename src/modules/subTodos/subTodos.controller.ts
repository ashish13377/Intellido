// subTodos.controller.ts
import { SubTodosService, SubTodosSearchFilter } from "./subTodos.module";
import { SubTodosDocument } from "../../database/models/subtodos.model";

export class SubTodosController {
	private subTodosService: SubTodosService;

	constructor(subTodosService: SubTodosService) {
		this.subTodosService = subTodosService;
	}

	public createSubTodo = async (
		data: Partial<SubTodosDocument>
	): Promise<SubTodosDocument> => {
		return await this.subTodosService.create(data);
	};

	public getSubTodos = async (): Promise<SubTodosDocument[]> => {
		return await this.subTodosService.getAll();
	};

	public getSubTodoByQuery = async (
		query: Record<string, any>
	): Promise<SubTodosDocument | null> => {
		return await this.subTodosService.getByQuery(query);
	};

	public getSubTodoById = async (
		id: string
	): Promise<SubTodosDocument | null> => {
		return await this.subTodosService.getById(id);
	};


	public updateSubTodo = async (
		id: string,
		data: Partial<SubTodosDocument>
	): Promise<SubTodosDocument | null> => {
		return await this.subTodosService.update(id, data);
	};

	public deleteSubTodo = async (
		id: string
	): Promise<SubTodosDocument | null> => {
		return await this.subTodosService.delete(id);
	};

	public searchSubTodos = async (
		filter: SubTodosSearchFilter
	): Promise<SubTodosDocument[]> => {
		return await this.subTodosService.search(filter);
	};

	public updateMatchingSubTodos = async (
		filter: SubTodosSearchFilter,
		update: Partial<SubTodosDocument>
	): Promise<any> => {
		return await this.subTodosService.updateMatching(filter, update);
	};
}
