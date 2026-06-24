import { Response } from "express";
import Task from "../models/TaskDuty";
import { AuthRequest } from "../middlewares/authMiddleware";

// GET ALL TASKS — only returns logged in user's ACTIVE tasks

export const getTasks = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const tasks = await Task.find({
      userId: req.user?.id,
      isDraft: false,
      isDeleted: { $ne: true }
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET TRASHED TASKS — only returns logged in user's trashed tasks

export const getTrashedTasks = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const tasks = await Task.find({
      userId: req.user?.id,
      isDeleted: true, // only trashed tasks
    }).sort({ deletedAt: -1 }); // most recently trashed first

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET SINGLE TASK — must belong to logged in user

export const getTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user?.id,
    });

    if (!task) {
      res.status(404).json({ success: false, message: "Task not found" });
      return;
    }

    res.status(200).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// CREATE TASK — attaches userId from logged in user

export const createTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { taskTitle, taskDescription, tags, dueDate } = req.body;

    if (!taskTitle || !taskDescription || !dueDate || !tags) {
      res.status(400).json({
        success: false,
        message: "Title, description, category and due date are required",
      });
      return;
    }

    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (due < today) {
      res.status(400).json({
        success: false,
        message: "Due date cannot be in the past",
      });
      return;
    }

    // duplicate title check scoped to this user only
    // ignore trashed tasks so a trashed title can be reused
    const existingTask = await Task.findOne({
      taskTitle,
      userId: req.user?.id,
      isDeleted: { $ne: true },
    });
    if (existingTask) {
      res.status(400).json({
        success: false,
        message: "You already have a task with this title",
      });
      return;
    }

    const task = await Task.create({
      userId: req.user?.id,
      taskTitle,
      taskDescription,
      tags,
      dueDate: due,
      isCompleted: false,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// UPDATE TASK — only the owner can update their task

export const updateTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { taskTitle, taskDescription, tags, dueDate, isCompleted } = req.body;

    if (dueDate) {
      const due = new Date(dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (due < today) {
        res.status(400).json({
          success: false,
          message: "Due date cannot be in the past",
        });
        return;
      }
    }

    // findOne with userId ensures user can only update their own task
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?.id },
      { taskTitle, taskDescription, tags, dueDate, isCompleted },
      { returnDocument: "after", runValidators: true }
    );

    if (!task) {
      res.status(404).json({ success: false, message: "Task not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      ...(process.env.NODE_ENV === "development" && {
        error: (error as Error).message,
      }),
    });
  }
};

// DELETE TASK — SOFT DELETE
// Instead of removing the document, we flag it as deleted so the
// user can restore it from the trash page later.

export const deleteTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    // findOneAndUpdate scoped to userId so a user can only trash their own task
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?.id, isDeleted: { $ne: true } },
      { isDeleted: true, deletedAt: new Date() }, // flag it + stamp the time
      { returnDocument: "after"}
    );

    if (!task) {
      res.status(404).json({ success: false, message: "Task not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Task moved to trash",
    });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// RESTORE TASK — brings a trashed task back to the active list
export const restoreTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    // only restore a task that belongs to this user AND is currently trashed
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?.id, isDeleted: true },
      { isDeleted: false, deletedAt: null },
      { returnDocument: "after" }
    );

    if (!task) {
      res.status(404).json({ success: false, message: "Task not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Task restored successfully",
      task,
    });
  } catch (error) {
    console.error("Restore task error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};