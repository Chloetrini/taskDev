import { Router } from "express";
import { getTask, getTasks, createTask,deleteTask, updateTask } from "../controllers/taskController"; 


// task routes
const router = Router()

// public route - no token needed
router.get("/", getTasks)
router.get("/:id", getTask)
router.post("/", createTask)
router.put("/:id", updateTask)
router.delete("/:id", deleteTask)



export default router