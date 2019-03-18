import * as mongoose from 'mongoose';
import { TaskSchema } from '../models/taskModel';
import { Request, Response, Router } from 'express';
import Controller from './interface';
import { TokenService } from './tokenService';

const Task = mongoose.model('Task', TaskSchema);

export class TaskController implements Controller {

    public path = '/tasks';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, TokenService.decryptMiddleware, this.getTasks.bind(this));
        this.router.get(`${this.path}/:taskId`, TokenService.decryptMiddleware, this.getTaskWithID.bind(this));
        this.router.post(`${this.path}/create`, TokenService.decryptMiddleware, this.addNewTask.bind(this));
        this.router.post(`${this.path}/:taskId/edit`, TokenService.decryptMiddleware, this.editTask.bind(this));
        this.router.post(`${this.path}/:taskId/delete`, TokenService.decryptMiddleware, this.deleteTask.bind(this));
    }

    public getTasks(req: any, res: Response) {
        Task.find({ userId: req.userId }, (err, task) => {
            if (err) {
                res.send(err);
            }
            res.json(task);
        });
    }

    public addNewTask(req: any, res: Response) {
        let taskBody = Object.assign(req.body, { userId: req.userId });
        let newTask = new Task(taskBody);

        newTask.save((err, task) => {
            if (err) {
                res.send(err);
            }
            res.json(task);
        });
    }

    public getTaskWithID(req: any, res: Response) {
        Task.find({ _id: req.params.taskId, userId: req.userId }, (err, task) => {
            if (err) {
                res.send(err);
            }
            res.json(task);
        });
    }

    public editTask(req: any, res: Response) {
        let taskBody = Object.assign(req.body, { userId: req.userId });

        Task.findOneAndUpdate({ _id: req.params.taskId, userId: req.userId }, taskBody, (err, task) => {
            if (err) {
                res.send(err);
            }
            res.json(task);
        });
    }

    public deleteTask(req: any, res: Response) {
        Task.remove({ _id: req.params.taskId, userId: req.userId }, (err, task) => {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'Successfully deleted task' });
        });
    }
}

export default TaskController;