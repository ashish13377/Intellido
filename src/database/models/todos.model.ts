import mongoose from "mongoose";
import { Schema } from "mongoose";

export interface TodosDocument extends Document {
	_id: mongoose.Types.ObjectId; 
	taskName: string;
	description: string;
	dueDate: Date;
	priority: number;
	isCompleted: boolean;
	type: string;
	label: string;
	createdAt: Date;
	updatedAt: Date;
}

const todosSchema = new Schema<TodosDocument>({
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
	type: {
		type: String,
		required: true,
		enum: ["user", "AI"],
		default: "user",
	},
	label: {
		type: String,
		required: true,
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

const TodosModel = mongoose.model<TodosDocument>("Todos", todosSchema);

export default TodosModel;
