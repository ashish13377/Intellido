import mongoose from "mongoose";
import { Schema } from "mongoose";

export interface ProjectDocument extends Document {
	_id: mongoose.Types.ObjectId;
	name: string;
	type: string;
	createdAt: Date;
	updatedAt: Date;
}

const projectSchema = new Schema<ProjectDocument>({
	name: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		required: true,
		enum: ["user", "AI"],
		default: "user",
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
		
	},
});

const ProjectModel = mongoose.model<ProjectDocument>(
	"Project",
	projectSchema,
);

export default ProjectModel;
