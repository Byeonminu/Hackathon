import * as express from "express"
import {db} from '../../db/db';

export const studyRouter = express.Router();

studyRouter.get('/', (req:express.Request, res:express.Response, next:express.NextFunction) =>{

        // db.query('insert into test (id) values (300)', (err2, result2)=>{
        //     res.send('router success');
        // })
       return res.render('study');
    
});

