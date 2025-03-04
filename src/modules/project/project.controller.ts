// project.controller.ts
import { ProjectRelationsFilter, ProjectService } from "./project.module";
import { ProjectDocument } from "../../database/models/project.model";

export class ProjectController {
	private projectService: ProjectService;

	constructor(projectService: ProjectService) {
		this.projectService = projectService;
	}

	public createProject = async (
		data: Partial<ProjectDocument>
	): Promise<ProjectDocument> => {
		return await this.projectService.create(data);
	};

	public getProjects = async (): Promise<ProjectDocument[]> => {
		return await this.projectService.getAll();
	};

	public getProjectById = async (
		id: string
	): Promise<ProjectDocument | null> => {
		return await this.projectService.getById(id);
	};

	public updateProject = async (
		id: string,
		data: Partial<ProjectDocument>
	): Promise<ProjectDocument | null> => {
		return await this.projectService.update(id, data);
	};

	public getProjectByQuery = async (
		query: Record<string, any>
	): Promise<ProjectDocument | null> => {
		return await this.projectService.getByQuery(query);
	};

	public deleteProject = async (
		id: string
	): Promise<ProjectDocument | null> => {
		return await this.projectService.delete(id);
	};

	public updateProjectByQuery = async (
		query: Record<string, any>,
		data: Partial<ProjectDocument>
	): Promise<ProjectDocument | null> => {
		return await this.projectService.updateByQuery(query, data);
	};

	public deleteProjectByQuery = async (
		query: Record<string, any>
	): Promise<ProjectDocument | null> => {
		return await this.projectService.deleteByQuery(query);
	};

	public findProjectsWithRelationsFunction = async (
		filters: ProjectRelationsFilter
	): Promise<any[]> => {
		return await this.projectService.findProjectsWithRelations(filters);
	};
}
