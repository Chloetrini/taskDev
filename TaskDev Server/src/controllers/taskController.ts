import { Request, Response } from "express";

import Task from "../models/TaskDuty";


// GET ALL TASKS
export const getTasks = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const tasks = await Task.find({ isDraft: false }).sort({
      createdAt: -1,
    });
    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// get single task

export const getTask = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404).json({ success: false, message: "Task not found" });
      return;
    }
    res.status(200).json({ success: true, task});
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// create task
export const createTask = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { taskTitle, taskDescription, tags, dueDate } = req.body;

   
    if (!taskTitle || !taskDescription || !dueDate) {
      res.status(400).json({
        success: false,
        message: "Title, description and due date are required",
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

    const existingTask = await Task.findOne({ taskTitle });
    if (existingTask) {
      res.status(400).json({ success: false, message: "Title already exists" });
      return;
    }

    const task = await Task.create({
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

// UPDATE TASK
export const updateTask = async (
  req: Request,
  res: Response,
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

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        taskTitle,
        taskDescription,
        tags,
        dueDate,
        isCompleted,
      },
      { new: true, runValidators: true }
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
    console.error("Update Task error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      ...(process.env.NODE_ENV === "development" && {
        error: (error as Error).message,
      }),
    });
  }
};


// DELETE TASK
export const deleteTask = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      res.status(404).json({ success: false, message: "Task not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};