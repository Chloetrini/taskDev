import mongoose, { Document, Schema } from "mongoose";

export interface ITask extends Document {
  taskTitle: string;
  taskDescription: string;
  tags?: "Urgent" | "Important";
  isDraft: boolean;
  isCompleted: boolean;
  dueDate: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    taskTitle: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
    },
    taskDescription: {
      type: String,
      required: [true, "Task description is required"],
    },
    tags: {
      type: String,
      enum: ["Urgent", "Important"],
    },
    isDraft: {
      type: Boolean,
      default: false,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model<ITask>("Task", TaskSchema);
export default Task;