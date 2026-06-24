import mongoose, { Document, Schema } from "mongoose";

// TASK MODEL
// Each task belongs to a user via userId

export interface ITask extends Document {
  userId: mongoose.Types.ObjectId;
  taskTitle: string;
  taskDescription: string;
  tags?: "Urgent" | "Important";
  isDraft: boolean;
  isCompleted: boolean;
  isDeleted: boolean;       
  deletedAt: Date | null;   
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    // links task to a specific user
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
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
    isDeleted: {
      type: Boolean,
      default: false,
    },
  
    deletedAt: {
      type: Date,
      default: null,
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

// index so queries by userId are fast
TaskSchema.index({ userId: 1 });

const Task = mongoose.model<ITask>("Task", TaskSchema);
export default Task;