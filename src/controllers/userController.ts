import * as mongoose from 'mongoose';
import { UserSchema } from '../models/userModel';
import { Request, Response, Router, NextFunction } from 'express';
import Controller from './interface';
import EmailAlreadyExistsException from '../exceptions/EmailAlreadyExistsException';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';

const User = mongoose.model('UserAuthentication', UserSchema);

export class UserController implements Controller {

    public path = '/user';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.post(`${this.path}/login`, this.login);
        this.router.post(`${this.path}/createAccount`, this.register);
        this.router.post(`${this.path}/:userId/edit`, this.editAccount);
        this.router.post(`${this.path}/:userId/delete`, this.deleteAccount);
    }

    // Create User Account
    public async register(req: Request, res: Response, next: NextFunction) {
        let newUser = new User(req.body);
        if (await User.findOne({ email: newUser.email })) {
            next(new EmailAlreadyExistsException(newUser.email));
        } else {
            newUser = await User.create({
                name: newUser.name,
                email: newUser.email,
                password: newUser.password,
            });
            newUser.password = undefined;
            res.send(newUser);
        }
    }

    // Login User
    public login(req: Request, res: Response, next: NextFunction) {
        let userEmail = req.body.email;
        User.findOne({ email: userEmail }, (err, user) => {
            if (err) {
                res.send(err);
            } else if (user) {
                const userPassword = req.body.password;
                if (user.password == userPassword) {
                    res.send({
                        name: user.name,
                        email: user.email
                    });
                } else {
                    next(new WrongCredentialsException());
                }
            } else {
                next(new WrongCredentialsException());
            }
        });

    }

    // Edit User Account info such as name, email, and password
    public editAccount(req: Request, res: Response) {
        User.findOneAndUpdate({ _id: req.params.userId }, req.body, { new: true }, (err, user) => {
            if (err) {
                res.send(err);
            }
            res.json(user);
        });
    }

    // Delete User Account
    public deleteAccount(req: Request, res: Response) {
        User.remove({ _id: req.params.userId }, (err, user) => {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'Successfully deleted account' });
        });
    }
}