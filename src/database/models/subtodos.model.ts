import mongoose from "mongoose";
import { Schema } from "mongoose";

export interface SubTodosDocument extends Document {
	_id: mongoose.Types.ObjectId; 
	projectId: mongoose.Types.ObjectId;
	parentId: mongoose.Types.ObjectId;
	taskName: string;
	description: string;
	dueDate: Date;
	priority: number;
	isCompleted: boolean;
	createdAt: Date;
	updatedAt: Date;
}

const subTodosSchema = new Schema<SubTodosDocument>({
	projectId: {
		type: Schema.Types.ObjectId,
		ref: "Projects",
		required: true,
	},
	parentId: {
		type: Schema.Types.ObjectId,
		ref: "Todos",
		required: true,
	},
	taskName: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	dueDate: {
		type: Date,
		required: true,
	},
	priority: {
		type: Number,
		required: true,
	},
	isCompleted: {
		type: Boolean,
		default: false,
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

const SubTodosModel = mongoose.model<SubTodosDocument>("SubTodos", subTodosSchema);

export default SubTodosModel;
