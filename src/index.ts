import express from "express"
import { router_test } from "./routes/test";
import path from "path"
import cookieParser from 'cookie-parser';

class App {
    public application: express.Application;
    constructor() {
        this.application = express();
    }
}
const app = new App().application;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use("/test", router_test);

app.get("/", (req: express.Request, res: express.Response) => {
    res.render('home');
})
app.listen(4000, () => console.log("start"));