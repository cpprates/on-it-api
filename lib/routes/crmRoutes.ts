import { Request, Response } from "express";
import { TaskController } from "../controllers/crmController";

export class Routes {

    public taskController: TaskController = new TaskController()

    public routes(app): void {

        app.route('/')
            .get((req: Request, res: Response) => {
                res.status(200).send({
                    message: 'GET request successfulll!!!!'
                })
            })

        // Create new Task 
        app.route('/task/create')
            .post(this.taskController.addNewTask)

        // Get all tasks
        app.route('/task')
            .get(this.taskController.getTasks)

        // Get specific task details
        app.route('/task/:taskId')
            .get(this.taskController.getTaskWithID)

        // Edit task
        app.route('/task/:taskId/edit')
            .post(this.taskController.editTask)

        // Delete task
        app.route('/task/:taskId/delete')
            .post(this.taskController.deleteTask)

    }
}