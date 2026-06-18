"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskController_1 = require("../controllers/taskController");
// task routes
const router = (0, express_1.Router)();
// public route - no token needed
router.get("/", taskController_1.getTasks);
router.get("/:id", taskController_1.getTask);
router.post("/", taskController_1.createTask);
router.put("/:id", taskController_1.updateTask);
router.delete("/:id", taskController_1.deleteTask);
exports.default = router;
