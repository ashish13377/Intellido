// subTodos.module.ts
import SubTodosModel, {
	SubTodosDocument,
} from "../../database/models/subtodos.model";

export interface SubTodosSearchFilter {
	taskName?: string;
	dueDate?: Date;
	priority?: number;
	isCompleted?: boolean;
	createdAt?: Date;
	searchTerm?: string;
}

export class SubTodosService {
	public async create(
		data: Partial<SubTodosDocument>
	): Promise<SubTodosDocument> {
		return await SubTodosModel.create(data);
	}

	public async getAll(): Promise<SubTodosDocument[]> {
		return await SubTodosModel.find();
	}

	public async getById(id: string): Promise<SubTodosDocument | null> {
		return await SubTodosModel.findById(id);
	}

	public async getByQuery(
		query: Record<string, any>
	): Promise<SubTodosDocument | null> {
		return await SubTodosModel.findOne(query);
	}

	public async update(
		id: string,
		data: Partial<SubTodosDocument>
	): Promise<SubTodosDocument | null> {
		return await SubTodosModel.findByIdAndUpdate(id, data, { new: true });
	}

	public async delete(id: string): Promise<SubTodosDocument | null> {
		return await SubTodosModel.findByIdAndDelete(id);
	}

	public async search(
		filter: SubTodosSearchFilter
	): Promise<SubTodosDocument[]> {
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

		return await SubTodosModel.find(query);
	}

	public async updateMatching(
		filter: SubTodosSearchFilter,
		update: Partial<SubTodosDocument>
	): Promise<any> {
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
		return await SubTodosModel.updateMany(query, update);
	}
}