"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTask = exports.getTasks = void 0;
const TaskDuty_1 = __importDefault(require("../models/TaskDuty"));
// GET ALL TASKS
const getTasks = async (req, res) => {
    try {
        const tasks = await TaskDuty_1.default.find({ isDraft: false }).sort({
            createdAt: -1,
        });
        res.status(200).json({
            success: true,
            count: tasks.length,
            tasks,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.getTasks = getTasks;
// get single task
const getTask = async (req, res) => {
    try {
        const task = await TaskDuty_1.default.findById(req.params.id);
        if (!task) {
            res.status(404).json({ success: false, message: "Task not found" });
            return;
        }
        res.status(200).json({ success: true, task });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
exports.getTask = getTask;
// create task
const createTask = async (req, res) => {
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
        const existingTask = await TaskDuty_1.default.findOne({ taskTitle });
        if (existingTask) {
            res.status(400).json({ success: false, message: "Title already exists" });
            return;
        }
        const task = await TaskDuty_1.default.create({
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
    }
    catch (error) {
        console.error("Create task error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.createTask = createTask;
// UPDATE TASK
const updateTask = async (req, res) => {
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
        const task = await TaskDuty_1.default.findByIdAndUpdate(req.params.id, {
            taskTitle,
            taskDescription,
            tags,
            dueDate,
            isCompleted,
        }, { new: true, runValidators: true });
        if (!task) {
            res.status(404).json({ success: false, message: "Task not found" });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Task updated successfully",
            task,
        });
    }
    catch (error) {
        console.error("Update Task error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            ...(process.env.NODE_ENV === "development" && {
                error: error.message,
            }),
        });
    }
};
exports.updateTask = updateTask;
// DELETE TASK
const deleteTask = async (req, res) => {
    try {
        const task = await TaskDuty_1.default.findByIdAndDelete(req.params.id);
        if (!task) {
            res.status(404).json({ success: false, message: "Task not found" });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Task deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete task error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.deleteTask = deleteTask;
