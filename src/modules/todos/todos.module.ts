import TodosModel, { TodosDocument } from "../../database/models/todos.model";

export interface TodosSearchFilter {
	taskName?: string;
	dueDate?: Date;
	priority?: number;
	isCompleted?: boolean;
	createdAt?: Date;
	// A term to be matched in either taskName or description fields
	searchTerm?: string;
}

export class TodosService {
	// Create a new Todo
	public async create(data: Partial<TodosDocument>): Promise<TodosDocument> {
		return await TodosModel.create(data);
	}

	// Get all Todos
	public async getAll(): Promise<TodosDocument[]> {
		return await TodosModel.find();
	}

	// Get a Todo by ID
	public async getById(id: string): Promise<TodosDocument | null> {
		return await TodosModel.findById(id);
	}

	// Get a single Todo based on any query
	public async getByQuery(
		query: Record<string, any>
	): Promise<TodosDocument | null> {
		return await TodosModel.findOne(query);
	}

	// Get many Todos based on any arbitrary query
	public async getManyByQuery(
		query: Record<string, any>
	): Promise<TodosDocument[]> {
		console.log("query", query);

		return await TodosModel.find(query);
	}

	// Update a Todo by ID
	public async update(
		id: string,
		data: Partial<TodosDocument>
	): Promise<TodosDocument | null> {
		return await TodosModel.findByIdAndUpdate(id, data, { new: true });
	}

	// Delete a Todo by ID
	public async delete(id: string): Promise<TodosDocument | null> {
		return await TodosModel.findByIdAndDelete(id);
	}

	// Search Todos based on various filter fields
	public async search(filter: TodosSearchFilter): Promise<TodosDocument[]> {
		const query: any = {};

		if (filter.taskName) {
			query.taskName = filter.taskName;
		}
		if (filter.dueDate) {
			query.dueDate = filter.dueDate;
		}
		if (filter.priority !== undefined) {
			query.priority = filter.priority;
		}
		if (filter.isCompleted !== undefined) {
			query.isCompleted = filter.isCompleted;
		}
		if (filter.createdAt) {
			query.createdAt = filter.createdAt;
		}

		// If a searchTerm is provided, perform a case‑insensitive search on both taskName and description
		if (filter.searchTerm) {
			query.$or = [
				{ taskName: { $regex: filter.searchTerm, $options: "i" } },
				{ description: { $regex: filter.searchTerm, $options: "i" } },
			];
		}

		return await TodosModel.find(query);
	}

	// Update all Todos matching the provided search filter with the given update value
	public async updateMatching(
		filters: any,
		updates: Partial<TodosDocument>
	): Promise<any> {
		const { filter, update } = filters;

		const query: any = {};

		if (filter.taskName) {
			query.taskName = filter.taskName;
		}
		if (filter.dueDate) {
			query.dueDate = filter.dueDate;
		}
		if (filter.priority !== undefined) {
			query.priority = filter.priority;
		}
		if (filter.isCompleted !== undefined) {
			query.isCompleted = filter.isCompleted;
		}
		if (filter.createdAt) {
			query.createdAt = filter.createdAt;
		}
		if (filter.searchTerm) {
			query.$or = [
				{ taskName: { $regex: filter.searchTerm, $options: "i" } },
				{ description: { $regex: filter.searchTerm, $options: "i" } },
			];
		}

		// Update all matching documents
		return await TodosModel.updateMany(query, update);
	}

	public async getByLabel(label: string): Promise<TodosDocument[]> {
		return await TodosModel.find({ label });
	}

	// Delete all Todos matching the provided search filter
	public async deleteMatching(filter: any): Promise<any> {
		console.log("filter", filter);
		

		const query: any = {};

		if (filter.taskName) {
			query.taskName = filter.taskName;
		}
		if (filter.dueDate) {
			query.dueDate = filter.dueDate;
		}
		if (filter.priority !== undefined) {
			query.priority = filter.priority;
		}
		if (filter.isCompleted !== undefined) {
			query.isCompleted = filter.isCompleted;
		}
		if (filter.createdAt) {
			query.createdAt = filter.createdAt;
		}
		if (filter.searchTerm) {
			query.$or = [
				{ taskName: { $regex: filter.searchTerm, $options: "i" } },
				{ description: { $regex: filter.searchTerm, $options: "i" } },
			];
		}

		// Delete all matching documents
		return await TodosModel.deleteMany(query);
	}
}
