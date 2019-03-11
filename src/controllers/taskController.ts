import * as mongoose from 'mongoose';
import { TaskSchema } from '../models/taskModel';
import { Request, Response, Router } from 'express';
import Controller from './interface';

const Task = mongoose.model('Task', TaskSchema);

export class TaskController implements Controller {

    public path = '/tasks';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.getTasks);
        this.router.get(`${this.path}/:taskId`, this.getTaskWithID);
        this.router.post(`${this.path}/create`, this.addNewTask);
        this.router.post(`${this.path}/:taskId/edit`, this.editTask);
        this.router.post(`${this.path}/:taskId/delete`, this.deleteTask);
    }

    public addNewTask(req: Request, res: Response) {
        let newTask = new Task(req.body);

        newTask.save((err, task) => {
            if (err) {
                res.send(err);
            }
            res.json(task);
        });
    }

    public getTasks(req: Request, res: Response) {
        Task.find({}, (err, task) => {
            if (err) {
                res.send(err);
            }
            res.json(task);
        });
    }

    public getTaskWithID(req: Request, res: Response) {
        Task.findById(req.params.taskId, (err, task) => {
            if (err) {
                res.send(err);
            }
            res.json(task);
        });
    }

    public editTask(req: Request, res: Response) {
        Task.findOneAndUpdate({ _id: req.params.taskId }, req.body, { new: true }, (err, task) => {
            if (err) {
                res.send(err);
            }
            res.json(task);
        });
    }

    public deleteTask(req: Request, res: Response) {
        Task.remove({ _id: req.params.taskId }, (err, task) => {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'Successfully deleted task ' });
        });
    }
}

export default TaskController;