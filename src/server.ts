import App from "./app";
import { UserController } from "./controllers/userController";
import { TaskController } from "./controllers/taskController";

const app = new App(
    [
        new TaskController(),
        new UserController(),
    ],
);

// Coming from listen() method in app.ts
app.listen();