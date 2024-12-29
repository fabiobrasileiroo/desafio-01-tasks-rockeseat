import { Router } from "express";
import { createTasks, deleteTasks, exportTasks, getTasks, patchTasks, putTasks } from "../controller/tasks.controller";

const router = Router()

router.post('/tasks', createTasks)
router.get('/tasks', getTasks)
router.get('/tasks/export', exportTasks)
router.put('/tasks/:id', putTasks)
router.delete('/tasks/:id',deleteTasks)
router.patch('/tasks/:id/complete',patchTasks)

export default router;