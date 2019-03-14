import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import Controller from './controllers/interface';
const PORT = 3000;

class App {

    public app: express.Application;
    // Production DataBase
    public mongoUrl: string = 'mongodb://root:root@ec2-18-204-24-255.compute-1.amazonaws.com:27017/onit?authSource=admin'
    // public mongoUrl: string = 'mongodb://localhost:27017/onit';

    constructor(controllers: Controller[]) {
        this.app = express();
        this.config();
        this.mongoSetup();
        this.initializeControllers(controllers);
    }

    public listen() {
        this.app.listen(PORT, () => {
            console.log('Express server listening on port ' + PORT);
        });
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
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

export default App;