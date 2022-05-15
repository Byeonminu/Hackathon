import express from "express"
import logger from 'morgan'
import { authRouter } from "./routes/auth";
import { studyRouter } from "./routes/study";
import { qnaRouter } from "./routes/qna";
import path from "path"
import cookieParser from 'cookie-parser';
import passport from 'passport';

import session from "express-session";
import sessionFileStore from "session-file-store";
import { db } from '../db/db';
import { nextTick } from "process";
import flash from 'connect-flash';

class App {
    public application: express.Application;
    constructor() {
        this.application = express();
    }
}
export const app = new App().application;
const Filestore = sessionFileStore(session);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true },
    store: new Filestore()
}))
app.use(flash());

require('./passport')(app);




app.use("/auth", authRouter);
app.use("/study", studyRouter);
app.use("/qna", qnaRouter);

app.get("/", (req: express.Request, res: express.Response, next: express.NextFunction) => {

    db.query('select * from user where nickname = ?',[req.user], (err, result) =>{
        if(err) next(err);

        let nickname: string = '';
        if(result.length != 0) {
            nickname = result[0].nickname + '님';
        }
      
        return res.render('home',{
            user_nickname: nickname
        });
    })
   
})
app.listen(4000, () => console.log("start"));

