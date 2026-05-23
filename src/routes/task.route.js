import { Router } from "express";
import { addTaskController, getTasksController, getTaskByIdController, updateTaskController, deleteTaskController } from "../controllers/task.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";


const router = Router()


router.post('/add-task', authenticate, addTaskController);
router.get('/get-tasks', authenticate, getTasksController);
router.get('/get-task-by-id/:id', authenticate, getTaskByIdController);
router.patch('/update-task/:id', authenticate, updateTaskController);
router.delete('/delete-task/:id', authenticate, deleteTaskController);


export default router;