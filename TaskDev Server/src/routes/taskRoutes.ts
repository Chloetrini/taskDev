import { Router } from "express";
import {getTasks,getTask,createTask, updateTask,deleteTask} from "../controllers/taskController";
import { protect } from "../middlewares/authMiddleware";

const router = Router();


// ALL TASK ROUTES — must be logged in
// Each user only sees and manages their own tasks

router.get("/", protect, getTasks);
router.get("/:id", protect, getTask);
router.post("/", protect, createTask);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);

export default router;