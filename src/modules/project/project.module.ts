// project.module.ts
import ProjectModel, {
	ProjectDocument,
} from "../../database/models/project.model";


export interface ProjectRelationsFilter {
	project?: Record<string, any>;
	todo?: Record<string, any>;
	subTodo?: Record<string, any>;
}

export class ProjectService {
	public async create(
		data: Partial<ProjectDocument>
	): Promise<ProjectDocument> {
		return await ProjectModel.create(data);
	}

	public async getAll(): Promise<ProjectDocument[]> {
		return await ProjectModel.find();
	}

	public async getById(id: string): Promise<ProjectDocument | null> {
		return await ProjectModel.findById(id);
	}

	public async update(
		id: string,
		data: Partial<ProjectDocument>
	): Promise<ProjectDocument | null> {
		return await ProjectModel.findByIdAndUpdate(id, data, { new: true });
	}

	public async delete(id: string): Promise<ProjectDocument | null> {
		return await ProjectModel.findByIdAndDelete(id);
	}

	public async getByQuery(
		query: Record<string, any>
	): Promise<ProjectDocument | null> {
		return await ProjectModel.findOne(query);
	}

	public async updateByQuery(
		query: Record<string, any>,
		data: Partial<ProjectDocument>
	): Promise<ProjectDocument | null> {
		return await ProjectModel.findOneAndUpdate(query, data, { new: true });
	}

	public async deleteByQuery(
		query: Record<string, any>
	): Promise<ProjectDocument | null> {
		return await ProjectModel.findOneAndDelete(query);
	}

	public async findProjectsWithRelations(
		filters: ProjectRelationsFilter
	): Promise<any[]> {
		const { project, todo, subTodo } = filters;

		const pipeline: any[] = [];

		if (project && Object.keys(project).length > 0) {
			pipeline.push({ $match: project });
		}

		pipeline.push({
			$lookup: {
				from: "todos", 
				let: { projectId: "$_id" },
				pipeline: [
					{ $match: { $expr: { $eq: ["$projectId", "$$projectId"] } } },
					...(todo && Object.keys(todo).length > 0 ? [{ $match: todo }] : []),
				],
				as: "todos",
			},
		});

		pipeline.push({
			$lookup: {
				from: "subtodos", // Ensure this matches your SubTodos collection name
				let: { todoIds: "$todos._id" },
				pipeline: [
					{ $match: { $expr: { $in: ["$parentId", "$$todoIds"] } } },
					// Apply additional filtering on SubTodos if provided.
					...(subTodo && Object.keys(subTodo).length > 0
						? [{ $match: subTodo }]
						: []),
				],
				as: "subTodos",
			},
		});

		pipeline.push({
			$match: {
				$or: [{ todos: { $ne: [] } }, { subTodos: { $ne: [] } }],
			},
		});

		return await ProjectModel.aggregate(pipeline);
	}
}
