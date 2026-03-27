import { Router } from "express";
import { addTask, getTasks, getTaskById, updateTask, deleteTask } from "../controllers/task.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";


const router = Router()


router.post('/add-task', authenticate, addTask);
router.get('/get-tasks', authenticate, getTasks);
router.get('/get-task-by-id/:id', authenticate, getTaskById);
router.patch('/update-task/:id', authenticate, updateTask);
router.post('/delete-task/:id', authenticate, deleteTask);


export default router;