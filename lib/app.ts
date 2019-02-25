import * as express from "express";
import * as bodyParser from "body-parser";
import { Routes } from "./routes/crmRoutes";
import * as mongoose from "mongoose";

class App {

    public app: express.Application;
    public routePrv: Routes = new Routes();
    // Production DataBase
    // public mongoUrl: string = 'mongodb://root:root@ec2-3-92-190-66.compute-1.amazonaws.com:27017/onit?authSource=admin'
    public mongoUrl: string = 'mongodb://localhost:27017/CRMdb';

    constructor() {
        this.app = express();
        this.config();
        this.routePrv.routes(this.app);
        this.mongoSetup();

    }

    private config(): void {
        // support application/json type post data
        this.app.use(bodyParser.json());
        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));
        // serving static files 
        this.app.use(express.static('public'));
    }

    private mongoSetup(): void {
        mongoose.Promise = global.Promise;
        // mongoose.connect(this.mongoUrl, { useNewUrlParser: true });

        mongoose.connect(this.mongoUrl).then(() => {
            console.log("Connected to Database");
        }).catch((err) => {
            console.log("Not Connected to Database ERROR! ", err);
        });
    }
}

export default new App().app;