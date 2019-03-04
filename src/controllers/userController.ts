import * as mongoose from 'mongoose';
import { UserSchema } from '../models/userModel';
import { Request, Response, Router } from 'express';
import Controller from './interface';

const User = mongoose.model('UserAuthentication', UserSchema);

export class UserController implements Controller {

    public path = '/user';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.get(`${this.path}/:userId`, this.login);
        this.router.post(`${this.path}/createAccount`, this.addNewUser);
        this.router.post(`${this.path}/:userId/edit`, this.editAccount);
        this.router.post(`${this.path}/:userId/delete`, this.deleteAccount);
    }

    // Create User Account
    public addNewUser(req: Request, res: Response) {
        let newUser = new User(req.body);

        newUser.save((err, task) => {
            if (err) {
                res.send(err);
            }
            res.json(task);
        });
    }

    // Login User
    public login(req: Request, res: Response) {
        User.findById(req.params.userId, (err, task) => {
            if (err) {
                res.send(err);
            }
            res.json(task);
        });
    }

    // Edit User Account info such as name, email, and password
    public editAccount(req: Request, res: Response) {
        User.findOneAndUpdate({ _id: req.params.userId }, req.body, { new: true }, (err, task) => {
            if (err) {
                res.send(err);
            }
            res.json(task);
        });
    }

    // Delete User Account
    public deleteAccount(req: Request, res: Response) {
        User.remove({ _id: req.params.userId }, (err, task) => {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'Successfully deleted account' });
        });
    }
}