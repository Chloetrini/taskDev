import { Router } from "express";
import {getTasks,getTrashedTasks,getTask,createTask,updateTask,deleteTask, restoreTask, finalDeleteTask } from "../controllers/taskController";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

// ALL TASK ROUTES — must be logged in
// Each user only sees and manages their own tasks

router.get("/", protect, getTasks);
router.get("/trash", protect, getTrashedTasks); 
router.get("/:id", protect, getTask);
router.post("/", protect, createTask);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask); // now a soft delete
router.delete("/:id/delete", protect, finalDeleteTask); // now a soft delete
router.put("/:id/restore", protect, restoreTask); // restore from trash

export default router;