import * as mongoose from 'mongoose';
import { UserSchema } from '../models/userModel';
import { Request, Response, Router, NextFunction } from 'express';
import Controller from './interface';
import EmailAlreadyExistsException from '../exceptions/EmailAlreadyExistsException';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';
import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationTokenException';
import { TokenService } from './tokenService';

const User = mongoose.model('UserAuthentication', UserSchema);

export class UserController implements Controller {

    public path = '/user';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.post(`${this.path}/login`, (req, res, next) => this.login(req, res, next));
        this.router.post(`${this.path}/createAccount`, this.register.bind(this));
        this.router.post(`${this.path}/edit`, TokenService.decryptMiddleware, this.editAccount.bind(this));
        this.router.post(`${this.path}/delete`, TokenService.decryptMiddleware, this.deleteAccount.bind(this));
        this.router.get(`${this.path}`, TokenService.decryptMiddleware, this.getUser.bind(this));
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
                res.send(err).status(500);
            } else if (user) {
                const userPassword = req.body.password;
                if (user.password == userPassword) {
                    const tokenData = TokenService.createToken(user);
                    res.send(tokenData);
                } else {
                    next(new WrongCredentialsException());
                }
            } else {
                next(new WrongCredentialsException());
            }
        });
    }

    // Get User Account
    public getUser(req: any, res: Response) {
        User.findById(req.userId, (err, user) => {
            if (err) {
                res.send(err);
            }
            res.send({
                name: user.name,
                email: user.email
            });
        });
    }

    // Edit User Account info such as name, email, and password
    public editAccount(req: any, res: Response, next: NextFunction) {
        User.findOneAndUpdate({ _id: req.userId }, req.body, { new: true }, (err, user) => {
            if (err) {
                next(new WrongAuthenticationTokenException());
                res.send(err);
            }
            res.send({
                name: user.name,
                email: user.email
            });
        });
    }

    // Delete User Account
    public deleteAccount(req: any, res: Response, next: NextFunction) {
        User.remove({ _id: req.userId }, (err, user) => {
            if (err) {
                next(new WrongAuthenticationTokenException());
                res.send(err);
            }
            res.json({ message: 'Successfully deleted account' });
        });
    }
}